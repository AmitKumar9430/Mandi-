package com.mandi.organization;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "organizations", indexes = {
        @Index(name = "idx_org_category", columnList = "category"),
        @Index(name = "idx_org_district", columnList = "district"),
        @Index(name = "idx_org_active", columnList = "active")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Organization extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private OrganizationCategory category = OrganizationCategory.OTHER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private DepartmentType departmentType = DepartmentType.GOVERNMENT_DEPT;

    @Column(length = 500)
    private String description;

    @Column(length = 100)
    private String district = "Lucknow";

    @Column(length = 50)
    private String state = "Uttar Pradesh";

    @Column(length = 200)
    private String address;

    @Column(length = 100)
    private String contactEmail;

    @Column(length = 30)
    private String contactPhone;

    @Column(length = 100)
    private String headOfDept;

    @Column(nullable = false)
    private boolean verified = true;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_user_id")
    private User leadUser;

    // Performance & SLA Tracking Metrics
    private Integer totalAssigned = 0;
    private Integer totalResolved = 0;
    private Integer totalOverdue = 0;
    private Integer reopenCount = 0;
    private Double avgResolutionHours = 0.0;
    private Double avgRating = 5.0;
    private Integer totalRatings = 0;

    public Organization() {}

    public Organization(String name, String code, OrganizationCategory category, DepartmentType departmentType, String district, String state, String contactPhone, String contactEmail) {
        this.name = name;
        this.code = code;
        this.category = category;
        this.departmentType = departmentType;
        this.district = district;
        this.state = state;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public OrganizationCategory getCategory() { return category; }
    public void setCategory(OrganizationCategory category) { this.category = category; }
    public DepartmentType getDepartmentType() { return departmentType; }
    public void setDepartmentType(DepartmentType departmentType) { this.departmentType = departmentType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getHeadOfDept() { return headOfDept; }
    public void setHeadOfDept(String headOfDept) { this.headOfDept = headOfDept; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public User getLeadUser() { return leadUser; }
    public void setLeadUser(User leadUser) { this.leadUser = leadUser; }
    public Integer getTotalAssigned() { return totalAssigned != null ? totalAssigned : 0; }
    public void setTotalAssigned(Integer totalAssigned) { this.totalAssigned = totalAssigned; }
    public Integer getTotalResolved() { return totalResolved != null ? totalResolved : 0; }
    public void setTotalResolved(Integer totalResolved) { this.totalResolved = totalResolved; }
    public Integer getTotalOverdue() { return totalOverdue != null ? totalOverdue : 0; }
    public void setTotalOverdue(Integer totalOverdue) { this.totalOverdue = totalOverdue; }
    public Integer getReopenCount() { return reopenCount != null ? reopenCount : 0; }
    public void setReopenCount(Integer reopenCount) { this.reopenCount = reopenCount; }
    public Double getAvgResolutionHours() { return avgResolutionHours != null ? avgResolutionHours : 0.0; }
    public void setAvgResolutionHours(Double avgResolutionHours) { this.avgResolutionHours = avgResolutionHours; }
    public Double getAvgRating() { return avgRating != null ? avgRating : 5.0; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    public Integer getTotalRatings() { return totalRatings != null ? totalRatings : 0; }
    public void setTotalRatings(Integer totalRatings) { this.totalRatings = totalRatings; }
}
