package com.mandi.problem;

import com.mandi.common.ApiResponse;
import com.mandi.problem.dto.FormSchemaResponse;
import com.mandi.user.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/problem-form")
public class FormSchemaController {

    private final FormSchemaService formSchemaService;

    public FormSchemaController(FormSchemaService formSchemaService) {
        this.formSchemaService = formSchemaService;
    }

    @GetMapping("/schema")
    public ResponseEntity<ApiResponse<FormSchemaResponse>> getSchema(
            @RequestParam(required = false, defaultValue = "ROLE_CITIZEN") Role role,
            @RequestParam(required = false, defaultValue = "REPORT_PROBLEM") RequestType requestType,
            @RequestParam(required = false, defaultValue = "AGRICULTURE") ProblemCategory category,
            @RequestParam(required = false) ServiceType serviceType) {

        FormSchemaResponse schema = formSchemaService.getSchema(role, requestType, category, serviceType);
        return ResponseEntity.ok(ApiResponse.ok(schema));
    }

    @GetMapping("/request-types")
    public ResponseEntity<ApiResponse<List<RequestType>>> getRequestTypes() {
        return ResponseEntity.ok(ApiResponse.ok(Arrays.asList(RequestType.values())));
    }

    @GetMapping("/service-types")
    public ResponseEntity<ApiResponse<List<ServiceType>>> getServiceTypes() {
        return ResponseEntity.ok(ApiResponse.ok(Arrays.asList(ServiceType.values())));
    }
}
