package com.mandi.agriculture;

import com.mandi.agriculture.dto.*;
import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import com.mandi.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class AgricultureController {

    private final AgricultureService agricultureService;

    public AgricultureController(AgricultureService agricultureService) {
        this.agricultureService = agricultureService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CropDto>> listCrop(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateCropRequest request) {
        CropDto created = agricultureService.createCrop(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Crop listed in MANDI Kisan Desk", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CropDto>>> searchCrops(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<CropDto> response = agricultureService.searchCrops(search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CropDto>>> getMyCrops(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<CropDto> crops = agricultureService.getFarmerCrops(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(crops));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CropDto>> getCropById(@PathVariable Long id) {
        CropDto crop = agricultureService.getCropById(id);
        return ResponseEntity.ok(ApiResponse.ok(crop));
    }

    @PostMapping("/{id}/inquiries")
    public ResponseEntity<ApiResponse<BuyerInquiryDto>> submitInquiry(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateInquiryRequest request) {
        BuyerInquiryDto inquiry = agricultureService.submitInquiry(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Inquiry/Bid submitted to farmer", inquiry));
    }

    @GetMapping("/{id}/inquiries")
    public ResponseEntity<ApiResponse<List<BuyerInquiryDto>>> getInquiriesForCrop(@PathVariable Long id) {
        List<BuyerInquiryDto> inquiries = agricultureService.getInquiriesForCrop(id);
        return ResponseEntity.ok(ApiResponse.ok(inquiries));
    }

    @PatchMapping("/inquiries/{inquiryId}/status")
    public ResponseEntity<ApiResponse<BuyerInquiryDto>> updateInquiryStatus(
            @PathVariable Long inquiryId,
            @RequestParam String status) {
        BuyerInquiryDto updated = agricultureService.updateInquiryStatus(inquiryId, status);
        return ResponseEntity.ok(ApiResponse.ok("Inquiry status updated", updated));
    }

    @GetMapping("/mandi-rates")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getMandiRates(
            @RequestParam(required = false) String district) {
        List<java.util.Map<String, Object>> rates = agricultureService.getMandiMarketRates(district);
        return ResponseEntity.ok(ApiResponse.ok(rates));
    }

    @GetMapping("/demand-board")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getDemandBoard(
            @RequestParam(required = false) String district) {
        List<java.util.Map<String, Object>> demands = agricultureService.getCropDemandBoard(district);
        return ResponseEntity.ok(ApiResponse.ok(demands));
    }

    @GetMapping("/weather-advisory")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getWeatherAdvisory(
            @RequestParam(required = false) String district) {
        java.util.Map<String, Object> weather = agricultureService.getWeatherAdvisory(district);
        return ResponseEntity.ok(ApiResponse.ok(weather));
    }

    @GetMapping("/nearby-agri-services")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getNearbyAgriServices(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String district) {
        List<java.util.Map<String, Object>> services = agricultureService.getNearbyAgriServices(latitude, longitude, district);
        return ResponseEntity.ok(ApiResponse.ok(services));
    }

    @GetMapping("/storage-facilities")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getStorageFacilities(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String district) {
        List<java.util.Map<String, Object>> storages = agricultureService.getStorageFacilities(latitude, longitude, district);
        return ResponseEntity.ok(ApiResponse.ok(storages));
    }

    @PostMapping("/emergency-broadcast")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> broadcastEmergency(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody java.util.Map<String, Object> req) {
        java.util.Map<String, Object> result = agricultureService.broadcastEmergency(userPrincipal.getId(), req);
        return ResponseEntity.ok(ApiResponse.ok("Farm Emergency Broadcasted", result));
    }
}
