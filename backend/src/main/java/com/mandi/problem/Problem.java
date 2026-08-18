package com.mandi.problem;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mandi.common.BaseEntity;
import com.mandi.organization.Organization;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems", indexes = {
        @Index(name = "idx_problem_status", columnList = "status"),
        @Index(name = "idx_problem_category", columnList = "category"),
        @Index(name = "idx_problem_urgency", columnList = "urgency"),
        @Index(name = "idx_problem_user", columnList = "user_id"),
        @Index(name = "idx_problem_org", columnList = "assigned_organization_id"),
        @Index(name = "idx_problem_location", columnList = "latitude, longitude"),
        @Index(name = "idx_problem_sla", columnList = "sla_deadline")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Problem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 3000)
    private String rawDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProblemCategory category = ProblemCategory.OTHER;

    @Column(length = 100)
    private String subCategory;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private RequestType requestType = RequestType.REPORT_PROBLEM;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private ServiceType serviceType;

    @Column(nullable = false)
    private boolean isOffer = false;

    private java.time.LocalDate requiredDate;
    private java.time.LocalTime requiredStartTime;
    private java.time.LocalTime requiredEndTime;

    private Double budgetAmount;

    @Column(length = 50)
    private String budgetUnit;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String structuredAttributes; // Dynamic JSON for landSize, tractorHp, operatorRequired, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProblemUrgency urgency = ProblemUrgency.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProblemStatus status = ProblemStatus.SUBMITTED;

    // Location & Contact
    @Column(length = 150)
    private String locationName;

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district = "Lucknow";

    @Column(length = 50)
    private String state = "Uttar Pradesh";

    @Column(length = 10)
    private String pincode;

    @Column(length = 300)
    private String address;

    @Column(length = 150)
    private String landmark;

    private Double latitude;
    private Double longitude;

    @Column(length = 30)
    private String contactPhone;

    @Column(length = 100)
    private String contactName;

    @Column(length = 1000)
    private String additionalComments;

    // Evidence & Attachments
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String audioRecordingUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String photoUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String videoUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String supportingDocUrl;

    @Column(length = 1000)
    private String extractedTags;

    @Column(length = 1000)
    private String requiredResourceTypes;

    // Organization & Resolver Assignment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_organization_id")
    private Organization assignedOrganization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_resolver_id")
    private User assignedResolver;

    private Instant assignedAt;
    private Instant acceptedAt;
    private Instant workStartedAt;
    private Instant resolvedAt;
    private Instant verificationRequestedAt;
    private Instant completedAt;
    private Instant closedAt;

    // SLA & Overdue Management
    @Column(name = "sla_deadline")
    private Instant slaDeadline;

    @Column(length = 40)
    private String slaStatus = "ON_TIME"; // ON_TIME, AT_RISK, OVERDUE, COMPLETED_WITHIN_SLA, COMPLETED_AFTER_SLA

    @Column(nullable = false)
    private boolean isOverdue = false;

    @Column(nullable = false)
    private boolean isEscalated = false;

    @Column(length = 500)
    private String escalationReason;

    @Column(length = 100)
    private String escalatedBy;

    private Instant escalatedAt;

    // Resolution & Proof
    @Column(length = 2000)
    private String resolutionDescription;

    @Column(length = 1000)
    private String actionTaken;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resolutionProofUrl;

    @Column(length = 1000)
    private String resolverRemarks;

    // Verification & Reopening
    @Column(length = 1000)
    private String reopenReason;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String reopenProofUrl;

    private Integer reopenedCount = 0;

    // Feedback & Rating
    private Integer feedbackRating; // 1 to 5 Stars

    @Column(length = 1000)
    private String feedbackComments;

    @Column(length = 250)
    private String feedbackTags; // e.g. "FAST_RESOLUTION,COMPLETELY_SOLVED"

    @Version
    private Long version;

    @OneToOne(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProblemPassport passport;

    @JsonIgnore
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    private List<ProblemEvent> events = new ArrayList<>();

    public Problem() {}

    public void addEvent(ProblemEvent event) {
        events.add(event);
        event.setProblem(this);
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getRawDescription() { return rawDescription; }
    public void setRawDescription(String rawDescription) { this.rawDescription = rawDescription; }
    public ProblemCategory getCategory() { return category; }
    public void setCategory(ProblemCategory category) { this.category = category; }
    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public ProblemUrgency getUrgency() { return urgency; }
    public void setUrgency(ProblemUrgency urgency) { this.urgency = urgency; }
    public ProblemStatus getStatus() { return status; }
    public void setStatus(ProblemStatus status) { this.status = status; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public String getVillageOrTown() { return villageOrTown; }
    public void setVillageOrTown(String villageOrTown) { this.villageOrTown = villageOrTown; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getAdditionalComments() { return additionalComments; }
    public void setAdditionalComments(String additionalComments) { this.additionalComments = additionalComments; }
    public String getAudioRecordingUrl() { return audioRecordingUrl; }
    public void setAudioRecordingUrl(String audioRecordingUrl) { this.audioRecordingUrl = audioRecordingUrl; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getSupportingDocUrl() { return supportingDocUrl; }
    public void setSupportingDocUrl(String supportingDocUrl) { this.supportingDocUrl = supportingDocUrl; }
    public String getExtractedTags() { return extractedTags; }
    public void setExtractedTags(String extractedTags) { this.extractedTags = extractedTags; }
    public String getRequiredResourceTypes() { return requiredResourceTypes; }
    public void setRequiredResourceTypes(String requiredResourceTypes) { this.requiredResourceTypes = requiredResourceTypes; }
    public Organization getAssignedOrganization() { return assignedOrganization; }
    public void setAssignedOrganization(Organization assignedOrganization) { this.assignedOrganization = assignedOrganization; }
    public User getAssignedResolver() { return assignedResolver; }
    public void setAssignedResolver(User assignedResolver) { this.assignedResolver = assignedResolver; }
    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
    public Instant getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Instant acceptedAt) { this.acceptedAt = acceptedAt; }
    public Instant getWorkStartedAt() { return workStartedAt; }
    public void setWorkStartedAt(Instant workStartedAt) { this.workStartedAt = workStartedAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public Instant getVerificationRequestedAt() { return verificationRequestedAt; }
    public void setVerificationRequestedAt(Instant verificationRequestedAt) { this.verificationRequestedAt = verificationRequestedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public Instant getClosedAt() { return closedAt; }
    public void setClosedAt(Instant closedAt) { this.closedAt = closedAt; }
    public Instant getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(Instant slaDeadline) { this.slaDeadline = slaDeadline; }
    public String getSlaStatus() { return slaStatus; }
    public void setSlaStatus(String slaStatus) { this.slaStatus = slaStatus; }
    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }
    public boolean isEscalated() { return isEscalated; }
    public void setEscalated(boolean escalated) { isEscalated = escalated; }
    public String getEscalationReason() { return escalationReason; }
    public void setEscalationReason(String escalationReason) { this.escalationReason = escalationReason; }
    public String getEscalatedBy() { return escalatedBy; }
    public void setEscalatedBy(String escalatedBy) { this.escalatedBy = escalatedBy; }
    public Instant getEscalatedAt() { return escalatedAt; }
    public void setEscalatedAt(Instant escalatedAt) { this.escalatedAt = escalatedAt; }
    public String getResolutionDescription() { return resolutionDescription; }
    public void setResolutionDescription(String resolutionDescription) { this.resolutionDescription = resolutionDescription; }
    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }
    public String getResolutionProofUrl() { return resolutionProofUrl; }
    public void setResolutionProofUrl(String resolutionProofUrl) { this.resolutionProofUrl = resolutionProofUrl; }
    public String getResolverRemarks() { return resolverRemarks; }
    public void setResolverRemarks(String resolverRemarks) { this.resolverRemarks = resolverRemarks; }
    public String getReopenReason() { return reopenReason; }
    public void setReopenReason(String reopenReason) { this.reopenReason = reopenReason; }
    public String getReopenProofUrl() { return reopenProofUrl; }
    public void setReopenProofUrl(String reopenProofUrl) { this.reopenProofUrl = reopenProofUrl; }
    public Integer getReopenedCount() { return reopenedCount != null ? reopenedCount : 0; }
    public void setReopenedCount(Integer reopenedCount) { this.reopenedCount = reopenedCount; }
    public Integer getFeedbackRating() { return feedbackRating; }
    public void setFeedbackRating(Integer feedbackRating) { this.feedbackRating = feedbackRating; }
    public String getFeedbackComments() { return feedbackComments; }
    public void setFeedbackComments(String feedbackComments) { this.feedbackComments = feedbackComments; }
    public String getFeedbackTags() { return feedbackTags; }
    public void setFeedbackTags(String feedbackTags) { this.feedbackTags = feedbackTags; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public ProblemPassport getPassport() { return passport; }
    public void setPassport(ProblemPassport passport) { this.passport = passport; }
    public RequestType getRequestType() { return requestType != null ? requestType : RequestType.REPORT_PROBLEM; }
    public void setRequestType(RequestType requestType) { this.requestType = requestType; }
    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }
    public boolean isOffer() { return isOffer; }
    public void setOffer(boolean offer) { isOffer = offer; }
    public java.time.LocalDate getRequiredDate() { return requiredDate; }
    public void setRequiredDate(java.time.LocalDate requiredDate) { this.requiredDate = requiredDate; }
    public java.time.LocalTime getRequiredStartTime() { return requiredStartTime; }
    public void setRequiredStartTime(java.time.LocalTime requiredStartTime) { this.requiredStartTime = requiredStartTime; }
    public java.time.LocalTime getRequiredEndTime() { return requiredEndTime; }
    public void setRequiredEndTime(java.time.LocalTime requiredEndTime) { this.requiredEndTime = requiredEndTime; }
    public Double getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(Double budgetAmount) { this.budgetAmount = budgetAmount; }
    public String getBudgetUnit() { return budgetUnit; }
    public void setBudgetUnit(String budgetUnit) { this.budgetUnit = budgetUnit; }
    public String getStructuredAttributes() { return structuredAttributes; }
    public void setStructuredAttributes(String structuredAttributes) { this.structuredAttributes = structuredAttributes; }

    public List<ProblemEvent> getEvents() { return events; }
    public void setEvents(List<ProblemEvent> events) { this.events = events; }
}
