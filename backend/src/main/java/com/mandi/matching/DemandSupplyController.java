package com.mandi.matching;

import com.mandi.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demand-supply")
public class DemandSupplyController {

    private final DemandSupplyService demandSupplyService;

    public DemandSupplyController(DemandSupplyService demandSupplyService) {
        this.demandSupplyService = demandSupplyService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DemandSupplyService.DemandSupplySummary>> getSummary() {
        DemandSupplyService.DemandSupplySummary summary = demandSupplyService.getSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }
}
