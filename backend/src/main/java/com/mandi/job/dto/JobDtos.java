package com.mandi.job.dto;

import com.mandi.job.JobPosting;
import com.mandi.job.SkillExchange;
import com.mandi.job.TimeBankEntry;
import com.mandi.job.WorkerProfile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

public class JobDtos {

    public static class JobPostingDto {
        private Long id;
        private Long employerId;
        private String employerName;
        private String title;
        private String skillCategory;
        private String description;
        private Double compensationAmount;
        private String compensationType;
        private Integer durationDays;
        private String locationName;
        private String villageOrTown;
        private String district;
        private Double latitude;
        private Double longitude;
        private String status;
        private String contactPhone;
        private Instant createdAt;

        public static JobPostingDto from(JobPosting job) {
            JobPostingDto dto = new JobPostingDto();
            dto.id = job.getId();
            if (job.getEmployer() != null) {
                dto.employerId = job.getEmployer().getId();
                dto.employerName = job.getEmployer().getFullName();
            }
            dto.title = job.getTitle();
            dto.skillCategory = job.getSkillCategory();
            dto.description = job.getDescription();
            dto.compensationAmount = job.getCompensationAmount();
            dto.compensationType = job.getCompensationType();
            dto.durationDays = job.getDurationDays();
            dto.locationName = job.getLocationName();
            dto.villageOrTown = job.getVillageOrTown();
            dto.district = job.getDistrict();
            dto.latitude = job.getLatitude();
            dto.longitude = job.getLongitude();
            dto.status = job.getStatus();
            dto.contactPhone = job.getContactPhone();
            dto.createdAt = job.getCreatedAt();
            return dto;
        }

        public Long getId() { return id; }
        public Long getEmployerId() { return employerId; }
        public String getEmployerName() { return employerName; }
        public String getTitle() { return title; }
        public String getSkillCategory() { return skillCategory; }
        public String getDescription() { return description; }
        public Double getCompensationAmount() { return compensationAmount; }
        public String getCompensationType() { return compensationType; }
        public Integer getDurationDays() { return durationDays; }
        public String getLocationName() { return locationName; }
        public String getVillageOrTown() { return villageOrTown; }
        public String getDistrict() { return district; }
        public Double getLatitude() { return latitude; }
        public Double getLongitude() { return longitude; }
        public String getStatus() { return status; }
        public String getContactPhone() { return contactPhone; }
        public Instant getCreatedAt() { return createdAt; }
    }

    public static class CreateJobRequest {
        @NotBlank(message = "Job title is required")
        private String title;

        @NotBlank(message = "Skill category is required")
        private String skillCategory;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Compensation amount is required")
        @Positive(message = "Compensation must be positive")
        private Double compensationAmount;

        private String compensationType = "DAILY";
        private Integer durationDays;
        private String locationName;
        private String villageOrTown;
        private String district;
        private Double latitude;
        private Double longitude;
        private String contactPhone;

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
        public String getContactPhone() { return contactPhone; }
        public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    }

    public static class WorkerProfileDto {
        private Long id;
        private Long userId;
        private String fullName;
        private String phone;
        private String primarySkills;
        private Integer experienceYears;
        private Double dailyWageExpected;
        private boolean available;
        private String bio;

        public static WorkerProfileDto from(WorkerProfile wp) {
            WorkerProfileDto dto = new WorkerProfileDto();
            dto.id = wp.getId();
            if (wp.getUser() != null) {
                dto.userId = wp.getUser().getId();
                dto.fullName = wp.getUser().getFullName();
                dto.phone = wp.getUser().getPhone();
            }
            dto.primarySkills = wp.getPrimarySkills();
            dto.experienceYears = wp.getExperienceYears();
            dto.dailyWageExpected = wp.getDailyWageExpected();
            dto.available = wp.isAvailable();
            dto.bio = wp.getBio();
            return dto;
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getFullName() { return fullName; }
        public String getPhone() { return phone; }
        public String getPrimarySkills() { return primarySkills; }
        public Integer getExperienceYears() { return experienceYears; }
        public Double getDailyWageExpected() { return dailyWageExpected; }
        public boolean isAvailable() { return available; }
        public String getBio() { return bio; }
    }

    public static class TimeBankDto {
        private Long id;
        private Long userId;
        private String userName;
        private String skillOffered;
        private Double hoursAvailablePerWeek;
        private String availabilitySchedule;
        private String description;
        private boolean active;
        private Integer hoursContributedTotal;

        public static TimeBankDto from(TimeBankEntry tb) {
            TimeBankDto dto = new TimeBankDto();
            dto.id = tb.getId();
            if (tb.getUser() != null) {
                dto.userId = tb.getUser().getId();
                dto.userName = tb.getUser().getFullName();
            }
            dto.skillOffered = tb.getSkillOffered();
            dto.hoursAvailablePerWeek = tb.getHoursAvailablePerWeek();
            dto.availabilitySchedule = tb.getAvailabilitySchedule();
            dto.description = tb.getDescription();
            dto.active = tb.isActive();
            dto.hoursContributedTotal = tb.getHoursContributedTotal();
            return dto;
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getUserName() { return userName; }
        public String getSkillOffered() { return skillOffered; }
        public Double getHoursAvailablePerWeek() { return hoursAvailablePerWeek; }
        public String getAvailabilitySchedule() { return availabilitySchedule; }
        public String getDescription() { return description; }
        public boolean isActive() { return active; }
        public Integer getHoursContributedTotal() { return hoursContributedTotal; }
    }

    public static class SkillExchangeDto {
        private Long id;
        private Long userId;
        private String userName;
        private String skillOffered;
        private String skillNeeded;
        private String terms;
        private String status;

        public static SkillExchangeDto from(SkillExchange se) {
            SkillExchangeDto dto = new SkillExchangeDto();
            dto.id = se.getId();
            if (se.getUser() != null) {
                dto.userId = se.getUser().getId();
                dto.userName = se.getUser().getFullName();
            }
            dto.skillOffered = se.getSkillOffered();
            dto.skillNeeded = se.getSkillNeeded();
            dto.terms = se.getTerms();
            dto.status = se.getStatus();
            return dto;
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getUserName() { return userName; }
        public String getSkillOffered() { return skillOffered; }
        public String getSkillNeeded() { return skillNeeded; }
        public String getTerms() { return terms; }
        public String getStatus() { return status; }
    }
}
