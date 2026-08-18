package com.mandi.resource;

import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import com.mandi.resource.dto.CreateResourceRequest;
import com.mandi.resource.dto.ResourceDto;
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
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceDto>> createResource(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateResourceRequest request) {
        ResourceDto created = resourceService.createResource(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Resource listed in Community Bank", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ResourceDto>>> searchResources(
            @RequestParam(required = false) ResourceCategory category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        PageResponse<ResourceDto> result = resourceService.searchResources(category, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDto>> getResourceById(@PathVariable Long id) {
        ResourceDto resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.ok(resource));
    }

    @GetMapping("/map")
    public ResponseEntity<ApiResponse<List<ResourceDto>>> getMapResources() {
        List<ResourceDto> resources = resourceService.getMapResources();
        return ResponseEntity.ok(ApiResponse.ok(resources));
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<ApiResponse<ResourceDto>> toggleAvailability(@PathVariable Long id) {
        ResourceDto updated = resourceService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.ok("Resource availability updated", updated));
    }
}
