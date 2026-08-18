package com.mandi.matching;

import com.mandi.booking.Booking;
import com.mandi.booking.BookingRepository;
import com.mandi.booking.ProviderAvailability;
import com.mandi.booking.ProviderAvailabilityRepository;
import com.mandi.problem.Problem;
import com.mandi.problem.ProblemCategory;
import com.mandi.problem.ServiceType;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceCategory;
import com.mandi.resource.ResourceRepository;
import com.mandi.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class MatchingEngineService {

    private final ResourceRepository resourceRepository;
    private final ProviderAvailabilityRepository availabilityRepository;
    private final BookingRepository bookingRepository;

    public MatchingEngineService(
            ResourceRepository resourceRepository,
            ProviderAvailabilityRepository availabilityRepository,
            BookingRepository bookingRepository) {
        this.resourceRepository = resourceRepository;
        this.availabilityRepository = availabilityRepository;
        this.bookingRepository = bookingRepository;
    }

    public static class MatchCandidate {
        private Resource resource;
        private User provider;
        private double score;
        private double distanceKm;
        private List<String> matchedReasons = new ArrayList<>();
        private List<String> unmatchedWarnings = new ArrayList<>();
        private Double price;
        private String priceUnit;
        private LocalDate availableDate;
        private LocalTime availableStartTime;
        private LocalTime availableEndTime;
        private boolean doubleBookingRisk = false;

        public MatchCandidate(Resource resource, User provider, double score, double distanceKm,
                              List<String> matchedReasons, List<String> unmatchedWarnings,
                              Double price, String priceUnit, LocalDate availableDate,
                              LocalTime availableStartTime, LocalTime availableEndTime, boolean doubleBookingRisk) {
            this.resource = resource;
            this.provider = provider;
            this.score = score;
            this.distanceKm = distanceKm;
            this.matchedReasons = matchedReasons;
            this.unmatchedWarnings = unmatchedWarnings;
            this.price = price;
            this.priceUnit = priceUnit;
            this.availableDate = availableDate;
            this.availableStartTime = availableStartTime;
            this.availableEndTime = availableEndTime;
            this.doubleBookingRisk = doubleBookingRisk;
        }

        public Resource getResource() { return resource; }
        public User getProvider() { return provider; }
        public double getScore() { return score; }
        public double getDistanceKm() { return distanceKm; }
        public List<String> getMatchedReasons() { return matchedReasons; }
        public List<String> getReasons() { return matchedReasons; }
        public List<String> getUnmatchedWarnings() { return unmatchedWarnings; }
        public Double getPrice() { return price; }
        public String getPriceUnit() { return priceUnit; }
        public LocalDate getAvailableDate() { return availableDate; }
        public LocalTime getAvailableStartTime() { return availableStartTime; }
        public LocalTime getAvailableEndTime() { return availableEndTime; }
        public boolean isDoubleBookingRisk() { return doubleBookingRisk; }
    }

    public List<MatchCandidate> findBestMatches(Problem problem, int limit) {
        List<Resource> allAvailable = resourceRepository.findAll().stream()
                .filter(Resource::isAvailable)
                .toList();

        List<MatchCandidate> candidates = new ArrayList<>();
        LocalDate reqDate = problem.getRequiredDate() != null ? problem.getRequiredDate() : LocalDate.now();
        LocalTime reqStart = problem.getRequiredStartTime() != null ? problem.getRequiredStartTime() : LocalTime.of(8, 0);
        LocalTime reqEnd = problem.getRequiredEndTime() != null ? problem.getRequiredEndTime() : LocalTime.of(16, 0);
        ServiceType reqService = problem.getServiceType();
        Double reqBudget = problem.getBudgetAmount();

        for (Resource resource : allAvailable) {
            // Avoid self-matching
            if (problem.getUser() != null && resource.getOwner() != null &&
                    problem.getUser().getId().equals(resource.getOwner().getId())) {
                continue;
            }

            double distanceKm = calculateHaversineDistance(
                    problem.getLatitude() != null ? problem.getLatitude() : 26.8467,
                    problem.getLongitude() != null ? problem.getLongitude() : 80.9462,
                    resource.getLatitude() != null ? resource.getLatitude() : 26.8467,
                    resource.getLongitude() != null ? resource.getLongitude() : 80.9462
            );

            double score = 0.0;
            List<String> matched = new ArrayList<>();
            List<String> unmatched = new ArrayList<>();

            // 1. Service & Category Alignment (Weight: 30%)
            boolean isDirectServiceMatch = reqService != null && isServiceMatch(reqService, resource.getCategory(), resource.getName());
            boolean categoryMatch = isCategoryCompatible(problem.getCategory(), resource.getCategory());

            if (isDirectServiceMatch) {
                score += 30.0;
                matched.add("Exact service compatibility (" + (reqService != null ? reqService.name() : "Service") + ")");
            } else if (categoryMatch) {
                score += 22.0;
                matched.add("Domain category matches (" + resource.getCategory().name().replace("_", " ") + ")");
            } else {
                score += 8.0;
                unmatched.add("Alternative resource category");
            }

            // 2. Date & Schedule Compatibility (Weight: 20%)
            LocalDate availDate = reqDate;
            LocalTime availStart = LocalTime.of(8, 0);
            LocalTime availEnd = LocalTime.of(18, 0);

            List<ProviderAvailability> slots = resource.getOwner() != null
                    ? availabilityRepository.findByProviderIdAndAvailableDate(resource.getOwner().getId(), reqDate)
                    : Collections.emptyList();

            boolean hasExactSlot = false;
            if (!slots.isEmpty()) {
                for (ProviderAvailability slot : slots) {
                    if (!slot.isBlocked()) {
                        hasExactSlot = true;
                        availDate = slot.getAvailableDate();
                        availStart = slot.getStartTime();
                        availEnd = slot.getEndTime();
                        break;
                    }
                }
            }

            if (hasExactSlot) {
                score += 20.0;
                matched.add("Provider officially confirmed available on " + reqDate);
            } else {
                score += 12.0; // General operational availability
                matched.add("General availability on requested schedule");
            }

            // 3. Time Overlap & Collision Check (Weight: 15%)
            boolean isDoubleBooked = false;
            if (resource.getOwner() != null) {
                List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                        resource.getOwner().getId(),
                        reqDate,
                        reqStart,
                        reqEnd
                );
                if (!conflicts.isEmpty()) {
                    isDoubleBooked = true;
                    unmatched.add("Time conflict: Provider has another active booking during this slot");
                }
            }

            if (!isDoubleBooked) {
                if (reqStart.isAfter(availStart.minusMinutes(1)) && reqEnd.isBefore(availEnd.plusMinutes(1))) {
                    score += 15.0;
                    matched.add(String.format("Available full window (%s – %s)", reqStart, reqEnd));
                } else {
                    score += 10.0;
                    matched.add("Flexible operational hours");
                }
            } else {
                score += 0.0;
            }

            // 4. Location Proximity & Service Radius (Weight: 15%)
            if (distanceKm <= 5.0) {
                score += 15.0;
                matched.add(String.format("Hyperlocal: %.1f km away from village", distanceKm));
            } else if (distanceKm <= 15.0) {
                score += 11.0;
                matched.add(String.format("Nearby in district: %.1f km away", distanceKm));
            } else if (distanceKm <= 35.0) {
                score += 7.0;
                matched.add(String.format("Within service range: %.1f km", distanceKm));
            } else {
                score += 3.0;
                unmatched.add(String.format("Distance is %.0f km away", distanceKm));
            }

            // 5. Equipment Specifications (Weight: 10%)
            String descLower = (resource.getDescription() != null ? resource.getDescription() : "").toLowerCase();
            String nameLower = (resource.getName() != null ? resource.getName() : "").toLowerCase();
            String structLower = (problem.getStructuredAttributes() != null ? problem.getStructuredAttributes() : "").toLowerCase();

            if (structLower.contains("hp_50_60") || structLower.contains("50") || structLower.contains("55")) {
                if (descLower.contains("50 hp") || descLower.contains("55 hp") || nameLower.contains("50") || nameLower.contains("55")) {
                    score += 10.0;
                    matched.add("Engine horsepower matches heavy work requirements (50+ HP)");
                } else {
                    score += 6.0;
                    matched.add("Standard power agricultural machinery");
                }
            } else {
                score += 8.0;
                matched.add("Equipment specifications suitable for requested workload");
            }

            // 6. Price & Budget Compatibility (Weight: 5%)
            Double providerCost = resource.getCostPerUnit();
            if (providerCost == null || providerCost == 0.0) {
                score += 5.0;
                matched.add("Free / Community Seva assistance");
            } else if (reqBudget != null && providerCost <= reqBudget) {
                score += 5.0;
                matched.add(String.format("Within budget: ₹%.0f %s (Your budget: ₹%.0f)", providerCost, resource.getCostUnit() != null ? resource.getCostUnit() : "", reqBudget));
            } else {
                score += 3.0;
                matched.add(String.format("Standard transparent pricing: ₹%.0f %s", providerCost, resource.getCostUnit() != null ? resource.getCostUnit() : ""));
            }

            // 7. Provider Trust & Rating (Weight: 5%)
            if (resource.isVerified()) {
                matched.add("Verified & accredited MANDI provider badge");
            }
            if (resource.getRating() != null && resource.getRating() >= 4.5) {
                score += 5.0;
                matched.add(String.format("Top rated (%.1f ★, %d verified jobs)", resource.getRating(), resource.getSuccessfulCasesCount()));
            } else if (resource.getRating() != null && resource.getRating() >= 3.5) {
                score += 3.0;
            } else {
                score += 2.0;
            }

            double finalScore = Math.min(100.0, Math.round(score * 10.0) / 10.0);
            candidates.add(new MatchCandidate(
                    resource,
                    resource.getOwner(),
                    finalScore,
                    Math.round(distanceKm * 10.0) / 10.0,
                    matched,
                    unmatched,
                    resource.getCostPerUnit() != null ? resource.getCostPerUnit() : 1000.0,
                    resource.getCostUnit() != null ? resource.getCostUnit() : "per hour",
                    availDate,
                    availStart,
                    availEnd,
                    isDoubleBooked
            ));
        }

        candidates.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return candidates.stream().limit(limit).toList();
    }

    private boolean isServiceMatch(ServiceType serviceType, ResourceCategory resourceCategory, String resourceName) {
        if (serviceType == null || resourceCategory == null) return false;
        String name = resourceName != null ? resourceName.toUpperCase() : "";

        return switch (serviceType) {
            case TRACTOR, ROTAVATOR, CULTIVATOR, SEEDER_PLANTER, SPRAYER, THRESHER ->
                    resourceCategory == ResourceCategory.TRACTOR_EQUIPMENT || name.contains("TRACTOR") || name.contains("HARVESTER");
            case HARVESTER -> resourceCategory == ResourceCategory.TRACTOR_EQUIPMENT || name.contains("HARVESTER");
            case WATER_TANKER -> resourceCategory == ResourceCategory.WATER_TANKER || name.contains("WATER") || name.contains("TANKER");
            case FARM_LABOUR, SKILLED_LABOUR, MASON, CARPENTER, WELDER, PLUMBER, ELECTRICIAN ->
                    resourceCategory == ResourceCategory.SKILLED_MANPOWER || name.contains("WORKER") || name.contains("LABOUR") || name.contains("MISTRI");
            case TRANSPORT_VEHICLE, TROLLEY_TRAILER ->
                    resourceCategory == ResourceCategory.TRANSPORT_VEHICLE || name.contains("TRANSPORT") || name.contains("TRUCK");
            case COLD_STORAGE, WAREHOUSE ->
                    resourceCategory == ResourceCategory.STORAGE_FACILITY || name.contains("STORAGE");
            case MEDICAL_ASSISTANCE, AMBULANCE_EMERGENCY ->
                    resourceCategory == ResourceCategory.MEDICAL_EQUIPMENT || resourceCategory == ResourceCategory.EMERGENCY_SUPPLY;
            default -> false;
        };
    }

    private boolean isCategoryCompatible(ProblemCategory problemCategory, ResourceCategory resourceCategory) {
        if (problemCategory == null || resourceCategory == null) return false;

        return switch (problemCategory) {
            case AGRICULTURE -> resourceCategory == ResourceCategory.TRACTOR_EQUIPMENT ||
                    resourceCategory == ResourceCategory.TRANSPORT_VEHICLE ||
                    resourceCategory == ResourceCategory.STORAGE_FACILITY ||
                    resourceCategory == ResourceCategory.SKILLED_MANPOWER ||
                    resourceCategory == ResourceCategory.CROP_BUYER;
            case HEALTHCARE, EMERGENCY -> resourceCategory == ResourceCategory.MEDICAL_EQUIPMENT ||
                    resourceCategory == ResourceCategory.TRANSPORT_VEHICLE ||
                    resourceCategory == ResourceCategory.EMERGENCY_SUPPLY ||
                    resourceCategory == ResourceCategory.VOLUNTEER_TIME;
            case EDUCATION -> resourceCategory == ResourceCategory.EDUCATIONAL_MATERIAL ||
                    resourceCategory == ResourceCategory.VOLUNTEER_TIME ||
                    resourceCategory == ResourceCategory.COMMUNITY_HALL;
            case WATER_SANITATION -> resourceCategory == ResourceCategory.WATER_TANKER ||
                    resourceCategory == ResourceCategory.SKILLED_MANPOWER ||
                    resourceCategory == ResourceCategory.TOOL_KIT;
            case ELECTRICITY, INFRASTRUCTURE -> resourceCategory == ResourceCategory.SKILLED_MANPOWER ||
                    resourceCategory == ResourceCategory.TOOL_KIT ||
                    resourceCategory == ResourceCategory.TRANSPORT_VEHICLE;
            case EMPLOYMENT -> resourceCategory == ResourceCategory.SKILLED_MANPOWER ||
                    resourceCategory == ResourceCategory.VOLUNTEER_TIME;
            default -> resourceCategory == ResourceCategory.VOLUNTEER_TIME || resourceCategory == ResourceCategory.OTHER;
        };
    }

    public static double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
