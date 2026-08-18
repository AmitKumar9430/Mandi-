package com.mandi.coordination;

import com.mandi.agriculture.dto.CropOrderDto;
import com.mandi.common.ApiResponse;
import com.mandi.matching.DemandSupplyService;
import com.mandi.mitra.CoordinationRequest;
import com.mandi.security.UserPrincipal;
import com.mandi.transport.dto.TransportRequestDto;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coordination")
public class CoordinationController {

    private final CoordinationEngineService coordinationEngineService;
    private final DemandSupplyService demandSupplyService;
    private final UserRepository userRepository;

    public CoordinationController(
            CoordinationEngineService coordinationEngineService,
            DemandSupplyService demandSupplyService,
            UserRepository userRepository) {
        this.coordinationEngineService = coordinationEngineService;
        this.demandSupplyService = demandSupplyService;
        this.userRepository = userRepository;
    }

    @GetMapping("/opportunities")
    public ResponseEntity<ApiResponse<List<CoordinationEngineService.OpportunityCard>>> getMyOpportunities(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "10") int limit) {
        User user = userRepository.findById(principal.getId()).orElse(null);
        List<CoordinationEngineService.OpportunityCard> cards = coordinationEngineService.getOpportunitiesForUser(user, limit);
        return ResponseEntity.ok(ApiResponse.success(cards));
    }

    @PostMapping("/crop-order-transport")
    public ResponseEntity<ApiResponse<TransportRequestDto>> createLinkedTransport(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        Long cropOrderId = Long.parseLong(body.get("cropOrderId").toString());
        Double budgetAmount = body.get("budgetAmount") != null ? Double.parseDouble(body.get("budgetAmount").toString()) : 1500.0;
        String preferredVehicleType = body.get("preferredVehicleType") != null ? body.get("preferredVehicleType").toString() : "PICKUP";

        TransportRequestDto dto = coordinationEngineService.createLinkedTransportForCropOrder(
                principal.getId(), cropOrderId, budgetAmount, preferredVehicleType
        );
        return ResponseEntity.ok(ApiResponse.success(dto, "Linked transport request created and nearby transporters notified."));
    }

    @PostMapping("/counter-offer")
    public ResponseEntity<ApiResponse<Object>> submitCounterOffer(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        String entityType = body.get("entityType").toString();
        Long entityId = Long.parseLong(body.get("entityId").toString());
        Double counterPrice = Double.parseDouble(body.get("counterPrice").toString());
        String notes = body.get("notes") != null ? body.get("notes").toString() : "";
        LocalDate counterDate = body.get("counterDate") != null ? LocalDate.parse(body.get("counterDate").toString()) : null;
        LocalTime startTime = body.get("startTime") != null ? LocalTime.parse(body.get("startTime").toString()) : null;
        LocalTime endTime = body.get("endTime") != null ? LocalTime.parse(body.get("endTime").toString()) : null;

        Object result = coordinationEngineService.submitCounterOffer(
                principal.getId(), entityType, entityId, counterPrice, notes, counterDate, startTime, endTime
        );
        return ResponseEntity.ok(ApiResponse.success(result, "Counter offer submitted successfully"));
    }

    @PostMapping("/mitra-fallback")
    public ResponseEntity<ApiResponse<CoordinationRequest>> requestMitraFallback(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        String requirementType = body.get("requirementType") != null ? body.get("requirementType").toString() : "Machinery / Transport Shortage";
        String description = body.get("description") != null ? body.get("description").toString() : "Assistance requested";
        Double lat = body.get("latitude") != null ? Double.parseDouble(body.get("latitude").toString()) : null;
        Double lon = body.get("longitude") != null ? Double.parseDouble(body.get("longitude").toString()) : null;
        String village = body.get("village") != null ? body.get("village").toString() : null;
        String block = body.get("block") != null ? body.get("block").toString() : null;
        String district = body.get("district") != null ? body.get("district").toString() : null;

        CoordinationRequest cr = coordinationEngineService.requestMitraFallback(
                principal.getId(), requirementType, description, lat, lon, village, block, district
        );
        return ResponseEntity.ok(ApiResponse.success(cr, "Assistance request forwarded to nearest Village Mitra."));
    }

    @GetMapping("/demand-supply-gap")
    public ResponseEntity<ApiResponse<DemandSupplyService.DemandSupplySummary>> getDemandSupplyGap() {
        DemandSupplyService.DemandSupplySummary summary = demandSupplyService.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
