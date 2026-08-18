package com.mandi.matching;

import com.mandi.problem.Problem;
import com.mandi.problem.ProblemRepository;
import com.mandi.problem.ProblemStatus;
import com.mandi.problem.ServiceType;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DemandSupplyService {

    private final ProblemRepository problemRepository;
    private final ResourceRepository resourceRepository;

    public DemandSupplyService(ProblemRepository problemRepository, ResourceRepository resourceRepository) {
        this.problemRepository = problemRepository;
        this.resourceRepository = resourceRepository;
    }

    public static class DemandSupplyCluster {
        private String district;
        private String villageOrTown;
        private String serviceCategory;
        private long demandCount;
        private long supplyCount;
        private long gap; // positive = shortage/unmet demand, negative = surplus
        private double fulfillmentRate;

        public DemandSupplyCluster(String district, String villageOrTown, String serviceCategory,
                                   long demandCount, long supplyCount) {
            this.district = district != null ? district : "General";
            this.villageOrTown = villageOrTown != null && !villageOrTown.isBlank() ? villageOrTown : "All Villages";
            this.serviceCategory = serviceCategory;
            this.demandCount = demandCount;
            this.supplyCount = supplyCount;
            this.gap = demandCount - supplyCount;
            this.fulfillmentRate = demandCount > 0 ? Math.min(100.0, Math.round(((double) supplyCount / demandCount) * 1000.0) / 10.0) : 100.0;
        }

        public String getDistrict() { return district; }
        public String getVillageOrTown() { return villageOrTown; }
        public String getServiceCategory() { return serviceCategory; }
        public long getDemandCount() { return demandCount; }
        public long getSupplyCount() { return supplyCount; }
        public long getGap() { return gap; }
        public double getFulfillmentRate() { return fulfillmentRate; }
    }

    public static class DemandSupplySummary {
        private long totalActiveDemands;
        private long totalActiveSupplies;
        private long totalCriticalShortages;
        private List<DemandSupplyCluster> clusters;
        private List<DemandSupplyCluster> topShortages;

        public DemandSupplySummary(long totalActiveDemands, long totalActiveSupplies,
                                   long totalCriticalShortages, List<DemandSupplyCluster> clusters,
                                   List<DemandSupplyCluster> topShortages) {
            this.totalActiveDemands = totalActiveDemands;
            this.totalActiveSupplies = totalActiveSupplies;
            this.totalCriticalShortages = totalCriticalShortages;
            this.clusters = clusters;
            this.topShortages = topShortages;
        }

        public long getTotalActiveDemands() { return totalActiveDemands; }
        public long getTotalActiveSupplies() { return totalActiveSupplies; }
        public long getTotalCriticalShortages() { return totalCriticalShortages; }
        public List<DemandSupplyCluster> getClusters() { return clusters; }
        public List<DemandSupplyCluster> getTopShortages() { return topShortages; }
    }

    @Transactional(readOnly = true)
    public DemandSupplySummary getSummary() {
        List<Problem> activeProblems = problemRepository.findAll().stream()
                .filter(p -> p.getStatus() != ProblemStatus.CLOSED && p.getStatus() != ProblemStatus.REJECTED)
                .toList();

        List<Resource> availableResources = resourceRepository.findAll().stream()
                .filter(Resource::isAvailable)
                .toList();

        // Group Demands by District + ServiceType / Category
        Map<String, Long> demandMap = new HashMap<>();
        for (Problem p : activeProblems) {
            String dist = p.getDistrict() != null ? p.getDistrict() : "Lucknow";
            String cat = p.getServiceType() != null ? p.getServiceType().name() : p.getCategory().name();
            String key = dist + "::" + cat;
            demandMap.put(key, demandMap.getOrDefault(key, 0L) + 1L);
        }

        // Group Supplies by District + Category
        Map<String, Long> supplyMap = new HashMap<>();
        for (Resource r : availableResources) {
            String dist = r.getDistrict() != null ? r.getDistrict() : "Lucknow";
            String cat = mapResourceToKeyCategory(r);
            String key = dist + "::" + cat;
            supplyMap.put(key, supplyMap.getOrDefault(key, 0L) + 1L);
        }

        Set<String> allKeys = new HashSet<>();
        allKeys.addAll(demandMap.keySet());
        allKeys.addAll(supplyMap.keySet());

        List<DemandSupplyCluster> clusters = new ArrayList<>();
        long totalShortages = 0;

        for (String key : allKeys) {
            String[] parts = key.split("::");
            String dist = parts[0];
            String cat = parts.length > 1 ? parts[1] : "GENERAL";

            long dCount = demandMap.getOrDefault(key, 0L);
            long sCount = supplyMap.getOrDefault(key, 0L);

            DemandSupplyCluster cluster = new DemandSupplyCluster(dist, "", cat, dCount, sCount);
            clusters.add(cluster);

            if (cluster.getGap() > 0) {
                totalShortages += cluster.getGap();
            }
        }

        clusters.sort((a, b) -> Long.compare(b.getGap(), a.getGap()));
        List<DemandSupplyCluster> topShortages = clusters.stream()
                .filter(c -> c.getGap() > 0)
                .limit(5)
                .collect(Collectors.toList());

        return new DemandSupplySummary(
                activeProblems.size(),
                availableResources.size(),
                totalShortages,
                clusters,
                topShortages
        );
    }

    private String mapResourceToKeyCategory(Resource r) {
        if (r.getCategory() == null) return "GENERAL";
        return switch (r.getCategory()) {
            case TRACTOR_EQUIPMENT -> "TRACTOR";
            case WATER_TANKER -> "WATER_TANKER";
            case SKILLED_MANPOWER -> "SKILLED_LABOUR";
            case TRANSPORT_VEHICLE -> "TRANSPORT_VEHICLE";
            case STORAGE_FACILITY -> "COLD_STORAGE";
            case MEDICAL_EQUIPMENT -> "MEDICAL_ASSISTANCE";
            default -> r.getCategory().name();
        };
    }
}
