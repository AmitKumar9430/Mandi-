package com.mandi.community;

import com.mandi.common.ApiResponse;
import com.mandi.common.BaseEntity;
import com.mandi.common.PageResponse;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.security.UserPrincipal;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "civic_reports", indexes = {
        @Index(name = "idx_civic_category", columnList = "category"),
        @Index(name = "idx_civic_status", columnList = "status")
})
class CivicReport extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_user_id", nullable = false)
    private User reporter;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 50)
    private String category; // POTHOLE_ROAD, WATER_HANDPUMP, STREETLIGHT, DRAINAGE_SEWAGE, ELECTRICITY_POLE, GARBAGE

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(length = 100)
    private String department; // PWD, Jal Nigam, Gram Panchayat, Electricity Board, Municipal Corp

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String photoUrl;

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false, length = 30)
    private String status = "SUBMITTED"; // SUBMITTED, VERIFIED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resolutionProofUrl;

    private Integer upvotes = 1;

    public CivicReport() {}

    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getVillageOrTown() { return villageOrTown; }
    public void setVillageOrTown(String villageOrTown) { this.villageOrTown = villageOrTown; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getResolutionProofUrl() { return resolutionProofUrl; }
    public void setResolutionProofUrl(String resolutionProofUrl) { this.resolutionProofUrl = resolutionProofUrl; }
    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }
}

@Repository
interface CivicReportRepository extends JpaRepository<CivicReport, Long> {
    @Query("SELECT c FROM CivicReport c WHERE " +
            "(:category IS NULL OR c.category = :category) AND " +
            "(:status IS NULL OR c.status = :status) AND " +
            "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.villageOrTown) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<CivicReport> searchReports(@Param("category") String category, @Param("status") String status, @Param("search") String search, Pageable pageable);

    @Query("SELECT c FROM CivicReport c WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL AND c.status != 'CLOSED'")
    List<CivicReport> findActiveForMap();
}

public class CivicReportingBundle {

    public static class CivicReportDto {
        private Long id;
        private Long reporterId;
        private String reporterName;
        private String title;
        private String category;
        private String description;
        private String department;
        private String photoUrl;
        private String villageOrTown;
        private String district;
        private Double latitude;
        private Double longitude;
        private String status;
        private String resolutionProofUrl;
        private Integer upvotes;
        private Instant createdAt;

        public static CivicReportDto from(CivicReport c) {
            CivicReportDto dto = new CivicReportDto();
            dto.id = c.getId();
            if (c.getReporter() != null) {
                dto.reporterId = c.getReporter().getId();
                dto.reporterName = c.getReporter().getFullName();
            }
            dto.title = c.getTitle();
            dto.category = c.getCategory();
            dto.description = c.getDescription();
            dto.department = c.getDepartment();
            dto.photoUrl = c.getPhotoUrl();
            dto.villageOrTown = c.getVillageOrTown();
            dto.district = c.getDistrict();
            dto.latitude = c.getLatitude();
            dto.longitude = c.getLongitude();
            dto.status = c.getStatus();
            dto.resolutionProofUrl = c.getResolutionProofUrl();
            dto.upvotes = c.getUpvotes();
            dto.createdAt = c.getCreatedAt();
            return dto;
        }

        public Long getId() { return id; }
        public Long getReporterId() { return reporterId; }
        public String getReporterName() { return reporterName; }
        public String getTitle() { return title; }
        public String getCategory() { return category; }
        public String getDescription() { return description; }
        public String getDepartment() { return department; }
        public String getPhotoUrl() { return photoUrl; }
        public String getVillageOrTown() { return villageOrTown; }
        public String getDistrict() { return district; }
        public Double getLatitude() { return latitude; }
        public Double getLongitude() { return longitude; }
        public String getStatus() { return status; }
        public String getResolutionProofUrl() { return resolutionProofUrl; }
        public Integer getUpvotes() { return upvotes; }
        public Instant getCreatedAt() { return createdAt; }
    }

    public static class CreateCivicReportRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Category is required")
        private String category;

        @NotBlank(message = "Description is required")
        private String description;

        private String department;
        private String photoUrl;
        private String villageOrTown;
        private String district;
        private Double latitude;
        private Double longitude;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getPhotoUrl() { return photoUrl; }
        public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
        public String getVillageOrTown() { return villageOrTown; }
        public void setVillageOrTown(String villageOrTown) { this.villageOrTown = villageOrTown; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
    }
}

@Service
class CivicReportService {
    private final CivicReportRepository repository;
    private final UserRepository userRepository;

    public CivicReportService(CivicReportRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CivicReportingBundle.CivicReportDto createReport(Long reporterUserId, CivicReportingBundle.CreateCivicReportRequest request) {
        User reporter = userRepository.findById(reporterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", reporterUserId));

        CivicReport report = new CivicReport();
        report.setReporter(reporter);
        report.setTitle(request.getTitle());
        report.setCategory(request.getCategory());
        report.setDescription(request.getDescription());
        report.setDepartment(request.getDepartment() != null ? request.getDepartment() : "Gram Panchayat & PWD");
        report.setPhotoUrl(request.getPhotoUrl());
        report.setVillageOrTown(request.getVillageOrTown());
        report.setDistrict(request.getDistrict());
        report.setLatitude(request.getLatitude() != null ? request.getLatitude() : 26.8467);
        report.setLongitude(request.getLongitude() != null ? request.getLongitude() : 80.9462);
        report.setStatus("SUBMITTED");

        return CivicReportingBundle.CivicReportDto.from(repository.save(report));
    }

    @Transactional(readOnly = true)
    public PageResponse<CivicReportingBundle.CivicReportDto> searchReports(String category, String status, String search, Pageable pageable) {
        Page<CivicReport> page = repository.searchReports(category, status, search, pageable);
        List<CivicReportingBundle.CivicReportDto> dtos = page.getContent().stream().map(CivicReportingBundle.CivicReportDto::from).collect(Collectors.toList());
        return new PageResponse<>(dtos, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional
    public CivicReportingBundle.CivicReportDto upvoteReport(Long id) {
        CivicReport report = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CivicReport", id));
        report.setUpvotes(report.getUpvotes() + 1);
        return CivicReportingBundle.CivicReportDto.from(repository.save(report));
    }
}

@RestController
@RequestMapping("/api/civic")
class CivicReportController {
    private final CivicReportService service;

    public CivicReportController(CivicReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CivicReportingBundle.CivicReportDto>> createReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CivicReportingBundle.CreateCivicReportRequest request) {
        CivicReportingBundle.CivicReportDto created = service.createReport(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Civic issue reported and routed to department", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CivicReportingBundle.CivicReportDto>>> searchReports(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<CivicReportingBundle.CivicReportDto> response = service.searchReports(category, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<ApiResponse<CivicReportingBundle.CivicReportDto>> upvote(@PathVariable Long id) {
        CivicReportingBundle.CivicReportDto updated = service.upvoteReport(id);
        return ResponseEntity.ok(ApiResponse.ok("Civic issue verified/upvoted", updated));
    }
}
