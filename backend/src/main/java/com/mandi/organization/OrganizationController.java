package com.mandi.organization;

import com.mandi.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Organization>>> getOrganizations(
            @RequestParam(required = false) OrganizationCategory category,
            @RequestParam(required = false) String district) {
        List<Organization> orgs = (category != null || district != null)
                ? organizationService.searchOrganizations(category, district)
                : organizationService.getAllActiveOrganizations();
        return ResponseEntity.ok(ApiResponse.ok(orgs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Organization>> getOrganizationById(@PathVariable Long id) {
        Organization org = organizationService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(org));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = Arrays.stream(OrganizationCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
