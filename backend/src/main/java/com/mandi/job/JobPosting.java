package com.mandi.job;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "job_postings", indexes = {
        @Index(name = "idx_job_employer", columnList = "employer_user_id"),
        @Index(name = "idx_job_status", columnList = "status")
})
public class JobPosting extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_user_id", nullable = false)
    private User employer;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String skillCategory; // Mason (Mistri), Carpenter (Badhai), Plumber, Driver, Farm Labour, Electrician, Tutor

    @Column(nullable = false, length = 1500)
    private String description;

    @Column(nullable = false)
    private Double compensationAmount;

    @Column(nullable = false, length = 30)
    private String compensationType = "DAILY"; // DAILY, HOURLY, FIXED_CONTRACT, MONTHLY

    private Integer durationDays;

    @Column(length = 100)
    private String locationName;

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, FILLED, CANCELLED

    @Column(length = 50)
    private String contactPhone;

    public JobPosting() {}

    public User getEmployer() { return employer; }
    public void setEmployer(User employer) { this.employer = employer; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSkillCategory() { return skillCategory; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getCompensationAmount() { return compensationAmount; }
    public void setCompensationAmount(Double compensationAmount) { this.compensationAmount = compensationAmount; }
    public String getCompensationType() { return compensationType; }
    public void setCompensationType(String compensationType) { this.compensationType = compensationType; }
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
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
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
