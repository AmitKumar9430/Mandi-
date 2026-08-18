package com.mandi.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final IndianLocationService locationService;

    public LocationController(IndianLocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/states")
    public ResponseEntity<ApiResponse<List<String>>> getAllStates() {
        return ResponseEntity.ok(ApiResponse.ok(IndianLocationService.ALL_STATES));
    }

    @GetMapping("/resolve")
    public ResponseEntity<ApiResponse<Map<String, String>>> resolveLocation(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String state) {

        String normDist = IndianLocationService.normalizeDistrict(district);
        String resolvedState = IndianLocationService.resolveState(normDist, state);

        Map<String, String> result = new LinkedHashMap<>();
        result.put("district", normDist);
        result.put("state", resolvedState);

        return ResponseEntity.ok(ApiResponse.ok("Location resolved successfully", result));
    }
}
