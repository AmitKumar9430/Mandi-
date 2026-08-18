package com.mandi.scheme;

import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {
    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SchemeDto>>> searchSchemes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        PageResponse<SchemeDto> response = schemeService.searchSchemes(category, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchemeDto>> getSchemeById(@PathVariable Long id) {
        SchemeDto scheme = schemeService.getSchemeById(id);
        return ResponseEntity.ok(ApiResponse.ok(scheme));
    }
}
