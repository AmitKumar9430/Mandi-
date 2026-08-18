package com.mandi.agriculture;

import com.mandi.agriculture.dto.CropDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CropMatchingService {

    private final CropRepository cropRepository;

    public CropMatchingService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public static class CropMatchResult {
        private CropDto crop;
        private double matchScore;
        private double distanceKm;
        private List<String> matchReasons = new ArrayList<>();
        private List<String> warnings = new ArrayList<>();

        public CropDto getCrop() { return crop; }
        public void setCrop(CropDto crop) { this.crop = crop; }
        public double getMatchScore() { return matchScore; }
        public void setMatchScore(double matchScore) { this.matchScore = matchScore; }
        public double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
        public List<String> getMatchReasons() { return matchReasons; }
        public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }
        public List<String> getWarnings() { return warnings; }
        public void setWarnings(List<String> warnings) { this.warnings = warnings; }
    }

    @Transactional(readOnly = true)
    public List<CropMatchResult> findBestCropMatches(String cropName,
                                                     String variety,
                                                     Double requiredQuantity,
                                                     Double maxBudgetPerQuintal,
                                                     String qualityPref,
                                                     LocalDate requiredDate,
                                                     Double userLat,
                                                     Double userLon,
                                                     String userDistrict,
                                                     int limit) {
        List<Crop> availableCrops = cropRepository.findByStatus("AVAILABLE");
        List<CropMatchResult> results = new ArrayList<>();

        for (Crop c : availableCrops) {
            double score = 0.0;
            List<String> reasons = new ArrayList<>();
            List<String> warnings = new ArrayList<>();

            // 1. Crop Name & Variety Match (30%)
            if (cropName != null && !cropName.isBlank()) {
                String reqCrop = cropName.trim().toLowerCase();
                String listingCrop = c.getCropName().toLowerCase();
                if (listingCrop.contains(reqCrop) || reqCrop.contains(listingCrop)) {
                    score += 25.0;
                    if (variety != null && c.getVariety() != null &&
                            c.getVariety().toLowerCase().contains(variety.trim().toLowerCase())) {
                        score += 5.0;
                        reasons.add("Exact crop and variety match: " + c.getCropName() + " (" + c.getVariety() + ")");
                    } else {
                        score += 3.0;
                        reasons.add("Crop type matches: " + c.getCropName());
                    }
                } else {
                    // Non-matching crop
                    continue;
                }
            } else {
                score += 20.0;
            }

            // 2. Quantity Compatibility (20%)
            if (requiredQuantity != null && requiredQuantity > 0) {
                if (c.getQuantityQuintals() >= requiredQuantity) {
                    score += 20.0;
                    reasons.add("Full required quantity available (" + c.getQuantityQuintals() + " quintals in stock)");
                } else if (c.getQuantityQuintals() >= requiredQuantity * 0.5) {
                    score += 12.0;
                    reasons.add("Partial quantity available (" + c.getQuantityQuintals() + " quintals)");
                    warnings.add("Farmer has " + c.getQuantityQuintals() + " qtl available (you requested " + requiredQuantity + " qtl)");
                } else {
                    score += 5.0;
                    warnings.add("Low stock: only " + c.getQuantityQuintals() + " qtl");
                }
            } else {
                score += 15.0;
            }

            // 3. Location & Distance Proximity (15%)
            double distanceKm = 15.0;
            if (userLat != null && userLon != null && c.getLatitude() != null && c.getLongitude() != null) {
                distanceKm = calculateDistance(userLat, userLon, c.getLatitude(), c.getLongitude());
                if (distanceKm <= 10.0) {
                    score += 15.0;
                    reasons.add("Very close to you (" + String.format("%.1f", distanceKm) + " km away)");
                } else if (distanceKm <= 35.0) {
                    score += 11.0;
                    reasons.add("In nearby area (" + String.format("%.1f", distanceKm) + " km away)");
                } else {
                    score += 6.0;
                    reasons.add("Regional provider (" + String.format("%.1f", distanceKm) + " km away)");
                }
            } else if (userDistrict != null && c.getDistrict() != null &&
                    userDistrict.equalsIgnoreCase(c.getDistrict())) {
                score += 13.0;
                distanceKm = 12.0;
                reasons.add("Located in your district (" + c.getDistrict() + ")");
            } else {
                score += 8.0;
            }

            // 4. Date Match (15%)
            if (requiredDate != null && c.getHarvestDate() != null) {
                if (!c.getHarvestDate().isAfter(requiredDate)) {
                    score += 15.0;
                    reasons.add("Harvest ready by your required date");
                } else {
                    score += 5.0;
                    warnings.add("Harvest expected on " + c.getHarvestDate());
                }
            } else {
                score += 12.0;
                reasons.add("Ready for immediate dispatch / pickup");
            }

            // 5. Price Competitiveness (15%)
            if (maxBudgetPerQuintal != null && maxBudgetPerQuintal > 0) {
                if (c.getExpectedPricePerQuintal() <= maxBudgetPerQuintal) {
                    score += 15.0;
                    reasons.add("Price within your budget (₹" + c.getExpectedPricePerQuintal() + "/qtl vs budget ₹" + maxBudgetPerQuintal + ")");
                } else if (c.getExpectedPricePerQuintal() <= maxBudgetPerQuintal * 1.15) {
                    score += 8.0;
                    warnings.add("Slightly above budget: ₹" + c.getExpectedPricePerQuintal() + "/qtl");
                } else {
                    score += 3.0;
                    warnings.add("Price: ₹" + c.getExpectedPricePerQuintal() + "/qtl (Budget: ₹" + maxBudgetPerQuintal + ")");
                }
            } else {
                score += 12.0;
            }

            // 6. Quality Grade (5%)
            if (qualityPref != null && !qualityPref.isBlank() && !qualityPref.equalsIgnoreCase("ANY")) {
                if (c.getQualityGrade() != null && c.getQualityGrade().equalsIgnoreCase(qualityPref)) {
                    score += 5.0;
                    reasons.add("Matches preferred quality: " + c.getQualityGrade());
                } else {
                    score += 2.0;
                }
            } else {
                score += 5.0;
                if (c.getQualityGrade() != null) {
                    reasons.add("Quality grade: " + c.getQualityGrade());
                }
            }

            double finalScore = Math.min(99.0, Math.max(20.0, Math.round(score * 10.0) / 10.0));
            CropMatchResult res = new CropMatchResult();
            res.setCrop(CropDto.fromEntity(c));
            res.setMatchScore(finalScore);
            res.setDistanceKm(Math.round(distanceKm * 10.0) / 10.0);
            res.setMatchReasons(reasons);
            res.setWarnings(warnings);
            results.add(res);
        }

        results.sort(Comparator.comparingDouble(CropMatchResult::getMatchScore).reversed());
        return results.stream().limit(limit > 0 ? limit : 5).collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
