package com.mandi.mitra;

import com.mandi.common.ApiResponse;
import com.mandi.mitra.dto.EscalationRequest;
import com.mandi.mitra.dto.GroundVerificationRequest;
import com.mandi.mitra.dto.RequestAssistanceRequest;
import com.mandi.mitra.dto.VillageMitraDto;
import com.mandi.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/village-mitra")
public class VillageMitraController {

    private final VillageMitraService mitraService;

    public VillageMitraController(VillageMitraService mitraService) {
        this.mitraService = mitraService;
    }

    @GetMapping("/nearest")
    public ResponseEntity<ApiResponse<VillageMitraDto>> getNearestVillageMitra(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) String block,
            @RequestParam(required = false) String district) {
        VillageMitraDto dto = mitraService.findNearestVillageMitra(latitude, longitude, village, block, district);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping("/assistance")
    public ResponseEntity<ApiResponse<CoordinationRequest>> requestAssistance(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody RequestAssistanceRequest req) {
        CoordinationRequest cr = mitraService.requestAssistance(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success(cr, "Assistance request submitted to Village Mitra"));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<CoordinationRequest>>> getMitraRequests(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<CoordinationRequest> list = mitraService.getMitraRequests(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my-cases")
    public ResponseEntity<ApiResponse<List<CoordinationRequest>>> getRequesterCases(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<CoordinationRequest> list = mitraService.getRequesterCases(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<GroundVerification>> recordVerification(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody GroundVerificationRequest req) {
        GroundVerification gv = mitraService.recordGroundVerification(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success(gv, "Ground truth verification recorded"));
    }

    @GetMapping("/verifications/{problemId}")
    public ResponseEntity<ApiResponse<List<GroundVerification>>> getVerifications(
            @PathVariable Long problemId) {
        List<GroundVerification> list = mitraService.getProblemVerifications(problemId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/escalate/{id}")
    public ResponseEntity<ApiResponse<CoordinationRequest>> escalateRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody EscalationRequest req) {
        CoordinationRequest cr = mitraService.escalateRequest(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.success(cr, "Case escalated to " + req.getTargetLevel()));
    }
}
