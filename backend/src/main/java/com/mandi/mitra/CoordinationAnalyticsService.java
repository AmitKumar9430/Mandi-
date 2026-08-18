package com.mandi.mitra;

import com.mandi.agriculture.CropRepository;
import com.mandi.problem.ProblemRepository;
import com.mandi.transport.TransportRequestRepository;
import com.mandi.transport.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CoordinationAnalyticsService {

    private final ProblemRepository problemRepository;
    private final TransportRequestRepository transportRepository;
    private final VehicleRepository vehicleRepository;
    private final CropRepository cropRepository;
    private final CoordinationRequestRepository coordinationRepository;

    public CoordinationAnalyticsService(ProblemRepository problemRepository,
                                        TransportRequestRepository transportRepository,
                                        VehicleRepository vehicleRepository,
                                        CropRepository cropRepository,
                                        CoordinationRequestRepository coordinationRepository) {
        this.problemRepository = problemRepository;
        this.transportRepository = transportRepository;
        this.vehicleRepository = vehicleRepository;
        this.cropRepository = cropRepository;
        this.coordinationRepository = coordinationRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRegionalAnalytics(String district) {
        String targetDistrict = district != null ? district : "Lucknow";
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("district", targetDistrict);

        // 1. Demand & Supply Metrics
        long openProblems = problemRepository.count();
        long openTransportRequests = transportRepository.findByPickupDistrictIgnoreCaseAndStatus(targetDistrict, "REQUESTED").size();
        long availableVehicles = vehicleRepository.findByServiceDistrictIgnoreCaseAndActiveTrue(targetDistrict).size();
        long availableCrops = cropRepository.findByStatus("AVAILABLE").size();
        long escalatedCases = coordinationRepository.findByStatusOrderByCreatedAtDesc("ESCALATED").size();

        data.put("totalProblems", openProblems);
        data.put("transportDemand", openTransportRequests);
        data.put("transportSupply", availableVehicles);
        data.put("transportGap", Math.max(0, openTransportRequests - availableVehicles));
        data.put("availableCropsCount", availableCrops);
        data.put("escalatedCasesCount", escalatedCases);

        // 2. High Demand Routes
        List<Map<String, Object>> routes = new ArrayList<>();
        routes.add(createRouteMap("Malihabad", "Lucknow Mandi", "Tractor / Trolley", "28 Quintal Mango/Wheat", 4, 1));
        routes.add(createRouteMap("Gharuan", "Kharar Grain Market", "Tractor + Trolley", "35 Quintal Wheat", 6, 2));
        routes.add(createRouteMap("Bodhgaya", "Gaya Central Mandi", "Mini Truck / Pickup", "18 Quintal Rice", 3, 1));
        data.put("highDemandRoutes", routes);

        // 3. Resource Gap Clusters
        List<Map<String, Object>> clusters = new ArrayList<>();
        clusters.add(createClusterMap(targetDistrict, "TRACTOR", "High Machinery Demand for Plowing Season", 12, 3, 9));
        clusters.add(createClusterMap(targetDistrict, "TRANSPORT", "Crop Harvest Logistics to Mandis", 16, 5, 11));
        clusters.add(createClusterMap(targetDistrict, "CIVIC_WATER", "Handpump Repair & Water Tanker Need", 7, 2, 5));
        data.put("gapClusters", clusters);

        return data;
    }

    private Map<String, Object> createRouteMap(String from, String to, String vehicle, String cargo, int demandJobs, int activeCarriers) {
        Map<String, Object> m = new HashMap<>();
        m.put("origin", from);
        m.put("destination", to);
        m.put("recommendedVehicle", vehicle);
        m.put("cargoSummary", cargo);
        m.put("demandJobs", demandJobs);
        m.put("activeCarriers", activeCarriers);
        m.put("gap", Math.max(0, demandJobs - activeCarriers));
        m.put("combinedRouteFeasible", demandJobs >= 2);
        return m;
    }

    private Map<String, Object> createClusterMap(String dist, String type, String desc, int demand, int supply, int shortage) {
        Map<String, Object> m = new HashMap<>();
        m.put("district", dist);
        m.put("resourceType", type);
        m.put("description", desc);
        m.put("demandCount", demand);
        m.put("supplyCount", supply);
        m.put("shortage", shortage);
        m.put("fulfillmentPercentage", demand > 0 ? Math.round(((double) supply / demand) * 1000.0) / 10.0 : 100.0);
        return m;
    }
}
