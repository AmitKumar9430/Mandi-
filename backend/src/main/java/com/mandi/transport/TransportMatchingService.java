package com.mandi.transport;

import com.mandi.transport.dto.VehicleDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransportMatchingService {

    private final VehicleRepository vehicleRepository;
    private final VehicleAvailabilityRepository availabilityRepository;

    public TransportMatchingService(VehicleRepository vehicleRepository,
                                    VehicleAvailabilityRepository availabilityRepository) {
        this.vehicleRepository = vehicleRepository;
        this.availabilityRepository = availabilityRepository;
    }

    public static class TransportMatchResult {
        private VehicleDto vehicle;
        private double matchScore;
        private double distanceKm;
        private Double estimatedCost;
        private List<String> matchReasons = new ArrayList<>();
        private List<String> warnings = new ArrayList<>();

        public VehicleDto getVehicle() { return vehicle; }
        public void setVehicle(VehicleDto vehicle) { this.vehicle = vehicle; }
        public double getMatchScore() { return matchScore; }
        public void setMatchScore(double matchScore) { this.matchScore = matchScore; }
        public double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
        public Double getEstimatedCost() { return estimatedCost; }
        public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
        public List<String> getMatchReasons() { return matchReasons; }
        public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }
        public List<String> getWarnings() { return warnings; }
        public void setWarnings(List<String> warnings) { this.warnings = warnings; }
    }

    @Transactional(readOnly = true)
    public List<TransportMatchResult> findBestVehicleMatches(VehicleType preferredType,
                                                             Double requiredWeightTons,
                                                             LocalDate requiredDate,
                                                             LocalTime startTime,
                                                             LocalTime endTime,
                                                             Double budget,
                                                             Double pickupLat,
                                                             Double pickupLon,
                                                             String pickupDistrict,
                                                             int limit) {
        List<Vehicle> allVehicles = vehicleRepository.findByActiveTrue();
        List<TransportMatchResult> results = new ArrayList<>();

        for (Vehicle v : allVehicles) {
            double score = 0.0;
            List<String> reasons = new ArrayList<>();
            List<String> warnings = new ArrayList<>();

            // 1. Vehicle Type Compatibility (25%)
            if (preferredType != null) {
                if (v.getVehicleType() == preferredType) {
                    score += 25.0;
                    reasons.add("Exact preferred vehicle type: " + v.getVehicleType().name());
                } else if (isCompatibleAlternative(preferredType, v.getVehicleType())) {
                    score += 15.0;
                    reasons.add("Compatible transport alternative: " + v.getVehicleType().name());
                } else {
                    score += 5.0;
                }
            } else {
                score += 20.0;
                reasons.add("Suitable cargo vehicle: " + v.getVehicleType().name());
            }

            // 2. Schedule & Date Match (20%)
            // Check if vehicle is blocked or conflicting on this date/time
            boolean hasConflict = false;
            if (requiredDate != null && startTime != null && endTime != null) {
                List<VehicleAvailability> conflicts = availabilityRepository.findConflictingSlots(
                        v.getId(), requiredDate, startTime, endTime);
                if (!conflicts.isEmpty()) {
                    hasConflict = true;
                    warnings.add("Vehicle is already booked on " + requiredDate + " (" + startTime + "–" + endTime + ")");
                }
            }

            if (!hasConflict) {
                score += 20.0;
                reasons.add("Vehicle available on requested date & time slot");
            } else {
                score += 2.0;
            }

            // 3. Time Window Availability (20%)
            if (!hasConflict) {
                score += 20.0;
            }

            // 4. Distance / Location Proximity (15%)
            double distanceKm = 10.0;
            if (pickupLat != null && pickupLon != null && v.getLatitude() != null && v.getLongitude() != null) {
                distanceKm = calculateDistance(pickupLat, pickupLon, v.getLatitude(), v.getLongitude());
                if (distanceKm <= 8.0) {
                    score += 15.0;
                    reasons.add("Nearby provider station: " + String.format("%.1f", distanceKm) + " km away");
                } else if (distanceKm <= v.getMaxTravelRadiusKm()) {
                    score += 11.0;
                    reasons.add("Within provider service radius: " + String.format("%.1f", distanceKm) + " km away");
                } else {
                    score += 4.0;
                    warnings.add("Outside standard radius (" + String.format("%.1f", distanceKm) + " km away)");
                }
            } else if (pickupDistrict != null && v.getServiceDistrict() != null &&
                    pickupDistrict.equalsIgnoreCase(v.getServiceDistrict())) {
                score += 13.0;
                reasons.add("Based in your district (" + v.getServiceDistrict() + ")");
            } else {
                score += 8.0;
            }

            // 5. Weight Capacity Match (10%)
            if (requiredWeightTons != null && requiredWeightTons > 0) {
                double cap = v.getCapacityTons() != null ? v.getCapacityTons() : 3.0;
                if (cap >= requiredWeightTons) {
                    score += 10.0;
                    reasons.add("Payload capacity verified (" + cap + " Tons capacity)");
                } else {
                    score += 3.0;
                    warnings.add("Capacity is " + cap + " Tons (you requested " + requiredWeightTons + " Tons)");
                }
            } else {
                score += 8.0;
            }

            // 6. Price within budget (5%)
            Double estCost = v.getPricePerTrip() != null ? v.getPricePerTrip() : (v.getBasePrice() != null ? v.getBasePrice() : 1500.0);
            if (budget != null && budget > 0) {
                if (estCost <= budget) {
                    score += 5.0;
                    reasons.add("Estimated price within budget (₹" + estCost + " vs budget ₹" + budget + ")");
                } else {
                    score += 2.0;
                    warnings.add("Estimated rate: ₹" + estCost);
                }
            } else {
                score += 4.0;
            }

            // 7. Rating & Reliability (5%)
            double rating = v.getRating() != null ? v.getRating() : 4.5;
            if (rating >= 4.5) {
                score += 5.0;
                reasons.add("Highly rated carrier (" + rating + " ★, " + v.getTotalCompletedTrips() + " trips completed)");
            } else {
                score += 3.0;
            }

            double finalScore = Math.min(99.0, Math.max(25.0, Math.round(score * 10.0) / 10.0));
            TransportMatchResult res = new TransportMatchResult();
            res.setVehicle(VehicleDto.fromEntity(v));
            res.setMatchScore(finalScore);
            res.setDistanceKm(Math.round(distanceKm * 10.0) / 10.0);
            res.setEstimatedCost(estCost);
            res.setMatchReasons(reasons);
            res.setWarnings(warnings);
            results.add(res);
        }

        results.sort(Comparator.comparingDouble(TransportMatchResult::getMatchScore).reversed());
        return results.stream().limit(limit > 0 ? limit : 5).collect(Collectors.toList());
    }

    private boolean isCompatibleAlternative(VehicleType req, VehicleType candidate) {
        if (req == VehicleType.TRUCK && (candidate == VehicleType.MINI_TRUCK || candidate == VehicleType.PICKUP)) return true;
        if (req == VehicleType.TRACTOR_TROLLEY && (candidate == VehicleType.PICKUP || candidate == VehicleType.TEMPO)) return true;
        if (req == VehicleType.PICKUP && (candidate == VehicleType.TEMPO || candidate == VehicleType.MINI_TRUCK)) return true;
        return false;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
