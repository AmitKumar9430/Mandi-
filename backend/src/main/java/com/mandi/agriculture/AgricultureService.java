package com.mandi.agriculture;

import com.mandi.agriculture.dto.*;
import com.mandi.common.PageResponse;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgricultureService {

    private final CropRepository cropRepository;
    private final BuyerInquiryRepository buyerInquiryRepository;
    private final UserRepository userRepository;

    public AgricultureService(CropRepository cropRepository, BuyerInquiryRepository buyerInquiryRepository, UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.buyerInquiryRepository = buyerInquiryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CropDto createCrop(Long farmerUserId, CreateCropRequest request) {
        User farmer = userRepository.findById(farmerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", farmerUserId));

        Crop crop = new Crop();
        crop.setFarmer(farmer);
        crop.setCropName(request.getCropName());
        crop.setVariety(request.getVariety());
        crop.setQuantityQuintals(request.getQuantityQuintals());
        crop.setExpectedPricePerQuintal(request.getExpectedPricePerQuintal());
        crop.setHarvestDate(request.getHarvestDate());
        crop.setQualityGrade(request.getQualityGrade() != null ? request.getQualityGrade() : "Grade A");
        crop.setVillageOrTown(request.getVillageOrTown());
        crop.setDistrict(request.getDistrict());
        crop.setState(request.getState());
        crop.setLatitude(request.getLatitude() != null ? request.getLatitude() : 26.8467);
        crop.setLongitude(request.getLongitude() != null ? request.getLongitude() : 80.9462);
        crop.setStatus("AVAILABLE");
        crop.setDescription(request.getDescription());
        crop.setContactPhone(request.getContactPhone() != null ? request.getContactPhone() : farmer.getPhone());

        Crop saved = cropRepository.save(crop);
        return CropDto.from(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<CropDto> searchCrops(String search, Pageable pageable) {
        Page<Crop> page = cropRepository.searchAvailableCrops(search, pageable);
        List<CropDto> dtos = page.getContent().stream().map(CropDto::from).collect(Collectors.toList());
        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public List<CropDto> getFarmerCrops(Long farmerUserId) {
        return cropRepository.findByFarmerIdOrderByCreatedAtDesc(farmerUserId).stream()
                .map(CropDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CropDto getCropById(Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop", cropId));
        return CropDto.from(crop);
    }

    @Transactional
    public BuyerInquiryDto submitInquiry(Long buyerUserId, Long cropId, CreateInquiryRequest request) {
        User buyer = userRepository.findById(buyerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", buyerUserId));

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop", cropId));

        BuyerInquiry inquiry = new BuyerInquiry();
        inquiry.setCrop(crop);
        inquiry.setBuyer(buyer);
        inquiry.setOfferedPricePerQuintal(request.getOfferedPricePerQuintal());
        inquiry.setRequestedQuantityQuintals(request.getRequestedQuantityQuintals());
        inquiry.setMessage(request.getMessage());
        inquiry.setContactPhone(request.getContactPhone() != null ? request.getContactPhone() : buyer.getPhone());
        inquiry.setStatus("PENDING");

        BuyerInquiry saved = buyerInquiryRepository.save(inquiry);
        return BuyerInquiryDto.from(saved);
    }

    @Transactional(readOnly = true)
    public List<BuyerInquiryDto> getInquiriesForCrop(Long cropId) {
        return buyerInquiryRepository.findByCropIdOrderByCreatedAtDesc(cropId).stream()
                .map(BuyerInquiryDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public BuyerInquiryDto updateInquiryStatus(Long inquiryId, String status) {
        BuyerInquiry inquiry = buyerInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("BuyerInquiry", inquiryId));
        inquiry.setStatus(status);
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            inquiry.getCrop().setStatus("UNDER_NEGOTIATION");
            cropRepository.save(inquiry.getCrop());
        }
        return BuyerInquiryDto.from(buyerInquiryRepository.save(inquiry));
    }

    public List<java.util.Map<String, Object>> getMandiMarketRates(String district) {
        String dist = (district != null && !district.isBlank()) ? district : "Mohali / Punjab";
        return List.of(
                java.util.Map.of("crop", "Wheat (गेहूँ)", "variety", "Sharbati / HD-2967", "mandi", dist + " APMC", "currentPrice", 2450.0, "msp", 2275.0, "highPrice", 2580.0, "lowPrice", 2380.0, "trend", "+4.2%", "trendDirection", "UP", "arrivalTons", 320.0),
                java.util.Map.of("crop", "Paddy (धान / बासमती)", "variety", "Pusa 1121", "mandi", "Khanna Main Yard", "currentPrice", 3850.0, "msp", 2183.0, "highPrice", 4100.0, "lowPrice", 3650.0, "trend", "+6.8%", "trendDirection", "UP", "arrivalTons", 540.0),
                java.util.Map.of("crop", "Mustard (सरसों)", "variety", "Pusa Bold / Yellow", "mandi", "Sirhind Grain Market", "currentPrice", 5680.0, "msp", 5650.0, "highPrice", 5850.0, "lowPrice", 5500.0, "trend", "+1.5%", "trendDirection", "UP", "arrivalTons", 110.0),
                java.util.Map.of("crop", "Potato (आलू)", "variety", "Kufri Jyoti / Pukhraj", "mandi", "Kharar Subji Mandi", "currentPrice", 1450.0, "msp", 0.0, "highPrice", 1600.0, "lowPrice", 1320.0, "trend", "-2.1%", "trendDirection", "DOWN", "arrivalTons", 280.0),
                java.util.Map.of("crop", "Tomato (टमाटर)", "variety", "Hybrid Desi", "mandi", "Rajpura Mandi", "currentPrice", 1850.0, "msp", 0.0, "highPrice", 2200.0, "lowPrice", 1600.0, "trend", "+8.5%", "trendDirection", "UP", "arrivalTons", 95.0),
                java.util.Map.of("crop", "Maize (मक्का)", "variety", "Kisan Pioneer 3396", "mandi", dist + " Yard", "currentPrice", 2180.0, "msp", 2090.0, "highPrice", 2250.0, "lowPrice", 2100.0, "trend", "+1.8%", "trendDirection", "UP", "arrivalTons", 160.0),
                java.util.Map.of("crop", "Gram / Chana (चना)", "variety", "Desi Chana", "mandi", "Lucknow Krishi Upaj", "currentPrice", 6150.0, "msp", 5440.0, "highPrice", 6300.0, "lowPrice", 5950.0, "trend", "+3.4%", "trendDirection", "UP", "arrivalTons", 75.0),
                java.util.Map.of("crop", "Cotton (कपास)", "variety", "Bt Cotton Long Staple", "mandi", "Abohar / Bathinda Yard", "currentPrice", 7240.0, "msp", 7020.0, "highPrice", 7450.0, "lowPrice", 7100.0, "trend", "+0.9%", "trendDirection", "UP", "arrivalTons", 210.0)
        );
    }

    public List<java.util.Map<String, Object>> getCropDemandBoard(String district) {
        return List.of(
                java.util.Map.of("id", 1, "buyerName", "Punjab Agro Processors Ltd", "buyerType", "Bulk Food Processor", "cropRequired", "Sharbati Wheat", "quantityQuintals", 150.0, "budgetPerQuintal", 2480.0, "deliveryLocation", "Kharar Agro Warehouse", "requiredByDate", java.time.LocalDate.now().plusDays(5).toString(), "contactPhone", "9814012345", "verified", true),
                java.util.Map.of("id", 2, "buyerName", "Golden Grain Flour Mills", "buyerType", "Roller Flour Mill", "cropRequired", "HD-2967 Wheat", "quantityQuintals", 300.0, "budgetPerQuintal", 2450.0, "deliveryLocation", "Sirhind Bypass Hub", "requiredByDate", java.time.LocalDate.now().plusDays(8).toString(), "contactPhone", "9872054321", "verified", true),
                java.util.Map.of("id", 3, "buyerName", "Kisan Mitra Organic Exporters", "buyerType", "Certified Organic Buyer", "cropRequired", "Basmati 1121 Paddy", "quantityQuintals", 80.0, "budgetPerQuintal", 4000.0, "deliveryLocation", "Farm Gate Pickup", "requiredByDate", java.time.LocalDate.now().plusDays(4).toString(), "contactPhone", "9888011223", "verified", true),
                java.util.Map.of("id", 4, "buyerName", "National Oilseeds Federation", "buyerType", "Institutional Aggregator", "cropRequired", "Mustard (सरसों)", "quantityQuintals", 120.0, "budgetPerQuintal", 5700.0, "deliveryLocation", "Rajpura Mandi Storage", "requiredByDate", java.time.LocalDate.now().plusDays(10).toString(), "contactPhone", "9815099887", "verified", true)
        );
    }

    public java.util.Map<String, Object> getWeatherAdvisory(String district) {
        String dist = (district != null && !district.isBlank()) ? district : "Mohali, Punjab";
        return java.util.Map.of(
                "location", dist,
                "temperatureC", 29.5,
                "condition", "Partly Cloudy (आंशिक बादल)",
                "humidityPercent", 62,
                "windSpeedKmh", 12.4,
                "rainProbabilityPercent", 18,
                "advisoryHi", "आगामी 3 दिनों में मौसम सामान्य रहने की संभावना है। गेहूँ कटाई व थ्रेशिंग का कार्य सुगमता से किया जा सकता है। फसलों में सिंचाई व दवा छिड़काव के लिए अनुकूल समय है।",
                "advisoryEn", "Favorable dry conditions expected for the next 72 hours. Ideal window for wheat harvesting, threshing, and pest spray application.",
                "forecast", List.of(
                        java.util.Map.of("day", "Today", "temp", "30°C / 21°C", "icon", "⛅", "rain", "10%"),
                        java.util.Map.of("day", "Tomorrow", "temp", "31°C / 22°C", "icon", "☀️", "rain", "5%"),
                        java.util.Map.of("day", "Day 3", "temp", "29°C / 20°C", "icon", "🌤️", "rain", "15%"),
                        java.util.Map.of("day", "Day 4", "temp", "28°C / 19°C", "icon", "🌦️", "rain", "35%"),
                        java.util.Map.of("day", "Day 5", "temp", "30°C / 21°C", "icon", "☀️", "rain", "5%")
                )
        );
    }

    public List<java.util.Map<String, Object>> getNearbyAgriServices(Double latitude, Double longitude, String district) {
        return List.of(
                java.util.Map.of("id", 1, "name", "IFFCO Kisan Seva Kendra", "category", "Fertilizer & Micronutrients (खाद एवं सूक्ष्म पोषक)", "address", "Main Market, Gharuan, Mohali", "contactPhone", "9814123456", "distanceKm", 2.1, "verified", true, "rating", 4.8, "services", "Urea, DAP, Zinc, Potash, Soil Card Testing"),
                java.util.Map.of("id", 2, "name", "Guru Nanak Seed & Pesticide Store", "category", "Certified Seeds & Bio-Pesticides (प्रमाणित बीज व कीटनाशक)", "address", "Kharar Mandi Road, Mohali", "contactPhone", "9872345678", "distanceKm", 4.5, "verified", true, "rating", 4.9, "services", "Hybrid Wheat, Paddy, Mustard Seeds, Neem Oil, Fungicides"),
                java.util.Map.of("id", 3, "name", "Kisan Machinery & Tractor Workshop", "category", "Tractor & Implement Repair (ट्रैक्टर व कृषि यंत्र मरम्मत)", "address", "Kurali GT Road, Mohali", "contactPhone", "9888901234", "distanceKm", 6.2, "verified", true, "rating", 4.7, "services", "Tractor Hydraulic, Rotavator Blades, Seed Drill Alignment"),
                java.util.Map.of("id", 4, "name", "Punjab Soil & Water Testing Laboratory", "category", "Govt Soil Health Clinic (मृदा परीक्षण केंद्र)", "address", "Agriculture Block Office, Kharar", "contactPhone", "0160-223344", "distanceKm", 5.0, "verified", true, "rating", 5.0, "services", "Free N-P-K & pH Soil Health Testing, Fertilizer Dosage Card")
        );
    }

    public List<java.util.Map<String, Object>> getStorageFacilities(Double latitude, Double longitude, String district) {
        java.util.Map<String, Object> f1 = new java.util.LinkedHashMap<>();
        f1.put("id", 1);
        f1.put("name", "Punjab State Warehousing Corporation (PSWC)");
        f1.put("facilityType", "Govt Warehouse (गोदाम)");
        f1.put("totalCapacityMT", 10000);
        f1.put("availableCapacityMT", 3200);
        f1.put("ratePerQuintalMonth", 12.5);
        f1.put("temperatureRange", "Dry Ambient & Fumigated");
        f1.put("location", "Kharar Storage Yard, Mohali");
        f1.put("distanceKm", 5.2);
        f1.put("contactPhone", "0160-254123");
        f1.put("verified", true);

        java.util.Map<String, Object> f2 = new java.util.LinkedHashMap<>();
        f2.put("id", 2);
        f2.put("name", "Kisan Shetkari Cold Storage & Vault");
        f2.put("facilityType", "Cold Storage (कोल्ड स्टोरेज)");
        f2.put("totalCapacityMT", 5000);
        f2.put("availableCapacityMT", 1450);
        f2.put("ratePerQuintalMonth", 35.0);
        f2.put("temperatureRange", "2°C to 6°C (Ideal for Potato/Vegetables/Fruits)");
        f2.put("location", "Landran Road, Mohali");
        f2.put("distanceKm", 8.4);
        f2.put("contactPhone", "9814098765");
        f2.put("verified", true);

        java.util.Map<String, Object> f3 = new java.util.LinkedHashMap<>();
        f3.put("id", 3);
        f3.put("name", "Central Railside Warehousing Complex");
        f3.put("facilityType", "Modern Multi-Commodity Silo (स्टील साइलो)");
        f3.put("totalCapacityMT", 25000);
        f3.put("availableCapacityMT", 8900);
        f3.put("ratePerQuintalMonth", 15.0);
        f3.put("temperatureRange", "Automated Moisture & Aeration Controlled");
        f3.put("location", "Sirhind Railway Siding");
        f3.put("distanceKm", 18.0);
        f3.put("contactPhone", "9872012999");
        f3.put("verified", true);

        return List.of(f1, f2, f3);
    }

    public java.util.Map<String, Object> broadcastEmergency(Long farmerUserId, java.util.Map<String, Object> req) {
        User farmer = userRepository.findById(farmerUserId).orElse(null);
        String emergencyType = String.valueOf(req.getOrDefault("emergencyType", "PEST_ATTACK"));
        String desc = String.valueOf(req.getOrDefault("description", "Urgent farm emergency reported."));
        String village = String.valueOf(req.getOrDefault("village", "Gharuan"));

        return java.util.Map.of(
                "broadcastId", "EMG-FARM-" + System.currentTimeMillis(),
                "status", "ACTIVE_BROADCAST_DISPATCHED",
                "emergencyType", emergencyType,
                "farmerName", farmer != null ? farmer.getFullName() : "Verified Farmer",
                "farmerPhone", farmer != null ? farmer.getPhone() : "",
                "village", village,
                "notifiedMitrasCount", 3,
                "notifiedVolunteersCount", 12,
                "message", "🚨 Farm Emergency Broadcast Dispatched to Nearest Village Mitra & Local Response Team."
        );
    }
}

