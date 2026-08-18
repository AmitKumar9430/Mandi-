package com.mandi.problem.dto;

import com.mandi.problem.ProblemCategory;
import com.mandi.problem.ProblemUrgency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateProblemRequest {

    @NotBlank(message = "Description of your problem is required")
    @Size(min = 5, max = 3000, message = "Description must be between 5 and 3000 characters")
    private String rawDescription;

    private String title;
    private ProblemCategory category;
    private String subCategory;
    private com.mandi.problem.RequestType requestType;
    private com.mandi.problem.ServiceType serviceType;
    private Boolean isOffer;

    private java.time.LocalDate requiredDate;
    private java.time.LocalTime requiredStartTime;
    private java.time.LocalTime requiredEndTime;

    private Double budgetAmount;
    private String budgetUnit;
    private String structuredAttributes;

    private ProblemUrgency urgency;

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

    private String audioRecordingUrl;
    private String photoUrl;
    private String videoUrl;
    private String supportingDocUrl;

    public CreateProblemRequest() {}

    public String getRawDescription() { return rawDescription; }
    public void setRawDescription(String rawDescription) { this.rawDescription = rawDescription; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ProblemCategory getCategory() { return category; }
    public void setCategory(ProblemCategory category) { this.category = category; }
    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }
    public ProblemUrgency getUrgency() { return urgency; }
    public void setUrgency(ProblemUrgency urgency) { this.urgency = urgency; }
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
    public com.mandi.problem.RequestType getRequestType() { return requestType; }
    public void setRequestType(com.mandi.problem.RequestType requestType) { this.requestType = requestType; }
    public com.mandi.problem.ServiceType getServiceType() { return serviceType; }
    public void setServiceType(com.mandi.problem.ServiceType serviceType) { this.serviceType = serviceType; }
    public Boolean getIsOffer() { return isOffer != null ? isOffer : false; }
    public void setIsOffer(Boolean isOffer) { this.isOffer = isOffer; }
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
}
