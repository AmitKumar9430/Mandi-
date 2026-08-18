package com.mandi.problem.dto;

import com.mandi.problem.*;

import java.time.Instant;
import java.util.List;

public class ProblemDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userPhone;
    private String userEmail;
    private String title;
    private String rawDescription;
    private ProblemCategory category;
    private String subCategory;
    private RequestType requestType;
    private ServiceType serviceType;
    private boolean isOffer;
    private java.time.LocalDate requiredDate;
    private java.time.LocalTime requiredStartTime;
    private java.time.LocalTime requiredEndTime;
    private Double budgetAmount;
    private String budgetUnit;
    private String structuredAttributes;
    private ProblemUrgency urgency;
    private ProblemStatus status;

    // Location & Contact
    private String locationName;
    private String villageOrTown;
    private String district;
    private String state;
    private String pincode;
    private String address;
    private String landmark;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private String contactName;
    private String additionalComments;

    // Evidence
    private String audioRecordingUrl;
    private String photoUrl;
    private String videoUrl;
    private String supportingDocUrl;
    private String extractedTags;
    private String requiredResourceTypes;
    private String passportCode;

    // Organization & Resolver Assignment
    private Long assignedOrganizationId;
    private String assignedOrganizationName;
    private String assignedOrganizationCode;
    private String assignedOrganizationPhone;
    private String assignedOrganizationEmail;
    private Long assignedResolverId;
    private String assignedResolverName;
    private Instant assignedAt;
    private Instant acceptedAt;
    private Instant workStartedAt;
    private Instant resolvedAt;
    private Instant verificationRequestedAt;
    private Instant completedAt;
    private Instant closedAt;

    // SLA & Overdue
    private Instant slaDeadline;
    private String slaStatus;
    private boolean isOverdue;
    private boolean isEscalated;
    private String escalationReason;
    private String escalatedBy;
    private Instant escalatedAt;

    // Resolution & Proof
    private String resolutionDescription;
    private String actionTaken;
    private String resolutionProofUrl;
    private String resolverRemarks;

    // Verification & Reopening
    private String reopenReason;
    private String reopenProofUrl;
    private Integer reopenedCount;

    // Feedback
    private Integer feedbackRating;
    private String feedbackComments;
    private String feedbackTags;

    private Long version;
    private Instant createdAt;
    private Instant updatedAt;
    private List<ProblemEventDto> events;

    public ProblemDto() {}

    public static ProblemDto from(Problem problem, String passportCode, List<ProblemEventDto> events) {
        ProblemDto dto = new ProblemDto();
        dto.setId(problem.getId());
        if (problem.getUser() != null) {
            dto.setUserId(problem.getUser().getId());
            dto.setUserName(problem.getUser().getFullName());
            dto.setUserPhone(problem.getUser().getPhone());
            dto.setUserEmail(problem.getUser().getEmail());
        }
        dto.setTitle(problem.getTitle());
        dto.setRawDescription(problem.getRawDescription());
        dto.setCategory(problem.getCategory());
        dto.setSubCategory(problem.getSubCategory());
        dto.setRequestType(problem.getRequestType());
        dto.setServiceType(problem.getServiceType());
        dto.setOffer(problem.isOffer());
        dto.setRequiredDate(problem.getRequiredDate());
        dto.setRequiredStartTime(problem.getRequiredStartTime());
        dto.setRequiredEndTime(problem.getRequiredEndTime());
        dto.setBudgetAmount(problem.getBudgetAmount());
        dto.setBudgetUnit(problem.getBudgetUnit());
        dto.setStructuredAttributes(problem.getStructuredAttributes());
        dto.setUrgency(problem.getUrgency());
        dto.setStatus(problem.getStatus());
        dto.setLocationName(problem.getLocationName());
        dto.setVillageOrTown(problem.getVillageOrTown());
        dto.setDistrict(problem.getDistrict());
        dto.setState(problem.getState());
        dto.setPincode(problem.getPincode());
        dto.setAddress(problem.getAddress());
        dto.setLandmark(problem.getLandmark());
        dto.setLatitude(problem.getLatitude());
        dto.setLongitude(problem.getLongitude());
        dto.setContactPhone(problem.getContactPhone());
        dto.setContactName(problem.getContactName());
        dto.setAdditionalComments(problem.getAdditionalComments());

        dto.setAudioRecordingUrl(problem.getAudioRecordingUrl());
        dto.setPhotoUrl(problem.getPhotoUrl());
        dto.setVideoUrl(problem.getVideoUrl());
        dto.setSupportingDocUrl(problem.getSupportingDocUrl());
        dto.setExtractedTags(problem.getExtractedTags());
        dto.setRequiredResourceTypes(problem.getRequiredResourceTypes());
        dto.setPassportCode(passportCode);

        if (problem.getAssignedOrganization() != null) {
            dto.setAssignedOrganizationId(problem.getAssignedOrganization().getId());
            dto.setAssignedOrganizationName(problem.getAssignedOrganization().getName());
            dto.setAssignedOrganizationCode(problem.getAssignedOrganization().getCode());
            dto.setAssignedOrganizationPhone(problem.getAssignedOrganization().getContactPhone());
            dto.setAssignedOrganizationEmail(problem.getAssignedOrganization().getContactEmail());
        }

        if (problem.getAssignedResolver() != null) {
            dto.setAssignedResolverId(problem.getAssignedResolver().getId());
            dto.setAssignedResolverName(problem.getAssignedResolver().getFullName());
        }

        dto.setAssignedAt(problem.getAssignedAt());
        dto.setAcceptedAt(problem.getAcceptedAt());
        dto.setWorkStartedAt(problem.getWorkStartedAt());
        dto.setResolvedAt(problem.getResolvedAt());
        dto.setVerificationRequestedAt(problem.getVerificationRequestedAt());
        dto.setCompletedAt(problem.getCompletedAt());
        dto.setClosedAt(problem.getClosedAt());

        dto.setSlaDeadline(problem.getSlaDeadline());
        dto.setSlaStatus(problem.getSlaStatus());
        dto.setOverdue(problem.isOverdue());
        dto.setEscalated(problem.isEscalated());
        dto.setEscalationReason(problem.getEscalationReason());
        dto.setEscalatedBy(problem.getEscalatedBy());
        dto.setEscalatedAt(problem.getEscalatedAt());

        dto.setResolutionDescription(problem.getResolutionDescription());
        dto.setActionTaken(problem.getActionTaken());
        dto.setResolutionProofUrl(problem.getResolutionProofUrl());
        dto.setResolverRemarks(problem.getResolverRemarks());

        dto.setReopenReason(problem.getReopenReason());
        dto.setReopenProofUrl(problem.getReopenProofUrl());
        dto.setReopenedCount(problem.getReopenedCount());

        dto.setFeedbackRating(problem.getFeedbackRating());
        dto.setFeedbackComments(problem.getFeedbackComments());
        dto.setFeedbackTags(problem.getFeedbackTags());

        dto.setVersion(problem.getVersion());
        dto.setCreatedAt(problem.getCreatedAt());
        dto.setUpdatedAt(problem.getUpdatedAt());
        dto.setEvents(events);
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
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
    public String getPassportCode() { return passportCode; }
    public void setPassportCode(String passportCode) { this.passportCode = passportCode; }
    public Long getAssignedOrganizationId() { return assignedOrganizationId; }
    public void setAssignedOrganizationId(Long assignedOrganizationId) { this.assignedOrganizationId = assignedOrganizationId; }
    public String getAssignedOrganizationName() { return assignedOrganizationName; }
    public void setAssignedOrganizationName(String assignedOrganizationName) { this.assignedOrganizationName = assignedOrganizationName; }
    public String getAssignedOrganizationCode() { return assignedOrganizationCode; }
    public void setAssignedOrganizationCode(String assignedOrganizationCode) { this.assignedOrganizationCode = assignedOrganizationCode; }
    public String getAssignedOrganizationPhone() { return assignedOrganizationPhone; }
    public void setAssignedOrganizationPhone(String assignedOrganizationPhone) { this.assignedOrganizationPhone = assignedOrganizationPhone; }
    public String getAssignedOrganizationEmail() { return assignedOrganizationEmail; }
    public void setAssignedOrganizationEmail(String assignedOrganizationEmail) { this.assignedOrganizationEmail = assignedOrganizationEmail; }
    public Long getAssignedResolverId() { return assignedResolverId; }
    public void setAssignedResolverId(Long assignedResolverId) { this.assignedResolverId = assignedResolverId; }
    public String getAssignedResolverName() { return assignedResolverName; }
    public void setAssignedResolverName(String assignedResolverName) { this.assignedResolverName = assignedResolverName; }
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
    public Integer getReopenedCount() { return reopenedCount; }
    public void setReopenedCount(Integer reopenedCount) { this.reopenedCount = reopenedCount; }
    public Integer getFeedbackRating() { return feedbackRating; }
    public void setFeedbackRating(Integer feedbackRating) { this.feedbackRating = feedbackRating; }
    public String getFeedbackComments() { return feedbackComments; }
    public void setFeedbackComments(String feedbackComments) { this.feedbackComments = feedbackComments; }
    public String getFeedbackTags() { return feedbackTags; }
    public void setFeedbackTags(String feedbackTags) { this.feedbackTags = feedbackTags; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public RequestType getRequestType() { return requestType; }
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

    public List<ProblemEventDto> getEvents() { return events; }
    public void setEvents(List<ProblemEventDto> events) { this.events = events; }
}
