package com.mandi.mitra.dto;

public class GroundVerificationRequest {
    private Long problemId;
    private String verificationStatus; // VERIFIED, NOT_VERIFIED, PARTIALLY_VERIFIED, UNABLE_TO_VERIFY
    private String observationNotes;
    private String evidencePhotoUrl;
    private Double latitude;
    private Double longitude;
    private String locationAddress;

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getObservationNotes() { return observationNotes; }
    public void setObservationNotes(String observationNotes) { this.observationNotes = observationNotes; }
    public String getEvidencePhotoUrl() { return evidencePhotoUrl; }
    public void setEvidencePhotoUrl(String evidencePhotoUrl) { this.evidencePhotoUrl = evidencePhotoUrl; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
}
