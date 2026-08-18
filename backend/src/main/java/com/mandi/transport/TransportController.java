package com.mandi.transport;

import com.mandi.common.ApiResponse;
import com.mandi.security.UserPrincipal;
import com.mandi.transport.dto.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/transport")
public class TransportController {

    private final TransportService transportService;
    private final TransportMatchingService matchingService;

    public TransportController(TransportService transportService,
                               TransportMatchingService matchingService) {
        this.transportService = transportService;
        this.matchingService = matchingService;
    }

    @PostMapping("/vehicles")
    @PreAuthorize("hasAnyAuthority('ROLE_SERVICE_PROVIDER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<VehicleDto>> registerVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreateVehicleRequest req) {
        VehicleDto dto = transportService.registerVehicle(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success(dto, "Vehicle registered successfully"));
    }

    @GetMapping("/vehicles/my")
    @PreAuthorize("hasAnyAuthority('ROLE_SERVICE_PROVIDER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getMyVehicles(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<VehicleDto> list = transportService.getProviderVehicles(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/vehicles/{id}/availability")
    @PreAuthorize("hasAnyAuthority('ROLE_SERVICE_PROVIDER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<VehicleAvailability>> setAvailability(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody VehicleAvailabilityRequest req) {
        VehicleAvailability va = transportService.setAvailability(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.success(va, "Availability slot published"));
    }

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<TransportRequestDto>> createRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreateTransportRequest req) {
        TransportRequestDto dto = transportService.createTransportRequest(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success(dto, "Transport request published"));
    }

    @GetMapping("/requests/my")
    public ResponseEntity<ApiResponse<List<TransportRequestDto>>> getMyRequests(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<TransportRequestDto> list = transportService.getMyRequests(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/requests/provider-jobs")
    public ResponseEntity<ApiResponse<List<TransportRequestDto>>> getMyProviderJobs(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<TransportRequestDto> list = transportService.getMyProviderJobs(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/requests/nearby")
    public ResponseEntity<ApiResponse<List<TransportRequestDto>>> getNearbyRequests(
            @RequestParam(defaultValue = "Lucknow") String district) {
        List<TransportRequestDto> list = transportService.getNearbyRequests(district);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<ApiResponse<TransportRequestDto>> acceptRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam Long vehicleId) {
        TransportRequestDto dto = transportService.acceptTransportRequest(principal.getId(), vehicleId, id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Transport request accepted. Slot booked."));
    }

    @PostMapping("/requests/{id}/counter")
    public ResponseEntity<ApiResponse<TransportRequestDto>> counterOffer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody TransportCounterOfferRequest req) {
        TransportRequestDto dto = transportService.counterOffer(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.success(dto, "Counter offer submitted"));
    }

    @PostMapping("/requests/{id}/confirm-counter")
    public ResponseEntity<ApiResponse<TransportRequestDto>> confirmCounter(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        TransportRequestDto dto = transportService.confirmCounterOffer(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Counter offer confirmed"));
    }

    @PostMapping("/requests/{id}/complete")
    public ResponseEntity<ApiResponse<TransportRequestDto>> completeTrip(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        TransportRequestDto dto = transportService.completeTrip(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Trip marked completed"));
    }

    @GetMapping("/matches")
    public ResponseEntity<ApiResponse<List<TransportMatchingService.TransportMatchResult>>> getTransportMatches(
            @RequestParam(required = false) VehicleType preferredType,
            @RequestParam(required = false) Double weightTons,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requiredDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam(required = false) Double budget,
            @RequestParam(required = false) Double pickupLat,
            @RequestParam(required = false) Double pickupLon,
            @RequestParam(required = false) String pickupDistrict,
            @RequestParam(defaultValue = "6") int limit) {
        List<TransportMatchingService.TransportMatchResult> matches = matchingService.findBestVehicleMatches(
                preferredType, weightTons, requiredDate, startTime, endTime, budget, pickupLat, pickupLon, pickupDistrict, limit
        );
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
}
