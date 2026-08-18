package com.mandi.job;

import com.mandi.common.ApiResponse;
import com.mandi.common.PageResponse;
import com.mandi.job.dto.JobDtos.*;
import com.mandi.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobPostingDto>> createJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateJobRequest request) {
        JobPostingDto created = jobService.createJob(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Job opportunity posted", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<JobPostingDto>>> searchJobs(
            @RequestParam(required = false) String skillCategory,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<JobPostingDto> response = jobService.searchJobs(skillCategory, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<JobPostingDto>>> getMyJobs(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<JobPostingDto> jobs = jobService.getEmployerJobs(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @PostMapping("/timebank")
    public ResponseEntity<ApiResponse<TimeBankDto>> registerTimeBank(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> body) {
        String skill = (String) body.get("skillOffered");
        Double hours = body.get("hoursAvailablePerWeek") != null ? Double.parseDouble(body.get("hoursAvailablePerWeek").toString()) : 2.0;
        String schedule = (String) body.get("availabilitySchedule");
        String desc = (String) body.get("description");

        TimeBankDto dto = jobService.registerTimeBank(userPrincipal.getId(), skill, hours, schedule, desc);
        return ResponseEntity.ok(ApiResponse.ok("TimeBank contribution listed", dto));
    }

    @GetMapping("/timebank")
    public ResponseEntity<ApiResponse<List<TimeBankDto>>> getTimeBank() {
        List<TimeBankDto> list = jobService.getTimeBankVolunteers();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/skill-exchange")
    public ResponseEntity<ApiResponse<SkillExchangeDto>> createSkillExchange(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {
        SkillExchangeDto dto = jobService.postSkillExchange(
                userPrincipal.getId(),
                body.get("skillOffered"),
                body.get("skillNeeded"),
                body.get("terms")
        );
        return ResponseEntity.ok(ApiResponse.ok("Skill exchange posted", dto));
    }

    @GetMapping("/skill-exchange")
    public ResponseEntity<ApiResponse<List<SkillExchangeDto>>> getSkillExchanges() {
        List<SkillExchangeDto> list = jobService.getSkillExchanges();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
