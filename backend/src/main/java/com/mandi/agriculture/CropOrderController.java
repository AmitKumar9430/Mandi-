package com.mandi.agriculture;

import com.mandi.agriculture.dto.CreateCropOrderRequest;
import com.mandi.agriculture.dto.CropOrderCounterRequest;
import com.mandi.agriculture.dto.CropOrderDto;
import com.mandi.common.ApiResponse;
import com.mandi.security.UserPrincipal;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crop-orders")
public class CropOrderController {

    private final CropOrderService cropOrderService;
    private final CropMatchingService cropMatchingService;

    public CropOrderController(CropOrderService cropOrderService,
                               CropMatchingService cropMatchingService) {
        this.cropOrderService = cropOrderService;
        this.cropMatchingService = cropMatchingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CropOrderDto>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CreateCropOrderRequest req) {
        CropOrderDto dto = cropOrderService.createOrder(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success(dto, "Crop purchase request submitted successfully"));
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<ApiResponse<List<CropOrderDto>>> getMyPurchases(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<CropOrderDto> list = cropOrderService.getBuyerOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/my-sales")
    public ResponseEntity<ApiResponse<List<CropOrderDto>>> getMySales(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<CropOrderDto> list = cropOrderService.getFarmerOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CropOrderDto>> getOrderById(@PathVariable Long id) {
        CropOrderDto dto = cropOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<CropOrderDto>> acceptOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        CropOrderDto dto = cropOrderService.acceptOrder(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Order accepted"));
    }

    @PostMapping("/{id}/counter")
    public ResponseEntity<ApiResponse<CropOrderDto>> counterOffer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody CropOrderCounterRequest req) {
        CropOrderDto dto = cropOrderService.counterOffer(principal.getId(), id, req);
        return ResponseEntity.ok(ApiResponse.success(dto, "Counter offer sent"));
    }

    @PostMapping("/{id}/confirm-counter")
    public ResponseEntity<ApiResponse<CropOrderDto>> confirmCounter(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        CropOrderDto dto = cropOrderService.confirmCounterOffer(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Counter offer accepted. Order confirmed."));
    }

    @PostMapping("/{id}/ready")
    public ResponseEntity<ApiResponse<CropOrderDto>> markReady(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        CropOrderDto dto = cropOrderService.markReady(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Marked ready for pickup / dispatch"));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<CropOrderDto>> completeOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        CropOrderDto dto = cropOrderService.completeOrder(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Order marked completed"));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<ApiResponse<CropOrderDto>> rateOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        int rating = body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : 5;
        String feedback = body.get("feedback") != null ? body.get("feedback").toString() : "";
        CropOrderDto dto = cropOrderService.rateOrder(principal.getId(), id, rating, feedback);
        return ResponseEntity.ok(ApiResponse.success(dto, "Rating recorded"));
    }

    @GetMapping("/best-matches")
    public ResponseEntity<ApiResponse<List<CropMatchingService.CropMatchResult>>> getBestCropMatches(
            @RequestParam(required = false) String cropName,
            @RequestParam(required = false) String variety,
            @RequestParam(required = false) Double quantity,
            @RequestParam(required = false) Double budget,
            @RequestParam(required = false) String quality,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String district,
            @RequestParam(defaultValue = "6") int limit) {
        List<CropMatchingService.CropMatchResult> matches = cropMatchingService.findBestCropMatches(
                cropName, variety, quantity, budget, quality, date, latitude, longitude, district, limit
        );
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
}
