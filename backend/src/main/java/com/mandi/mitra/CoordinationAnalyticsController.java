package com.mandi.mitra;

import com.mandi.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coordination")
public class CoordinationAnalyticsController {

    private final CoordinationAnalyticsService analyticsService;

    public CoordinationAnalyticsController(CoordinationAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/block")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBlockAnalytics(
            @RequestParam(defaultValue = "Lucknow") String district) {
        Map<String, Object> data = analyticsService.getRegionalAnalytics(district);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/district")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDistrictAnalytics(
            @RequestParam(defaultValue = "Lucknow") String district) {
        Map<String, Object> data = analyticsService.getRegionalAnalytics(district);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
