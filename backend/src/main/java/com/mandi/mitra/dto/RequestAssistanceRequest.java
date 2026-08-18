package com.mandi.mitra.dto;

public class RequestAssistanceRequest {
    private Long mitraId;
    private String coordinationType;
    private String title;
    private String description;
    private String village;
    private String block;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private Long linkedProblemId;
    private Long linkedTransportRequestId;
    private Long linkedCropOrderId;
    private Long linkedBookingId;

    public Long getMitraId() { return mitraId; }
    public void setMitraId(Long mitraId) { this.mitraId = mitraId; }
    public String getCoordinationType() { return coordinationType; }
    public void setCoordinationType(String coordinationType) { this.coordinationType = coordinationType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Long getLinkedProblemId() { return linkedProblemId; }
    public void setLinkedProblemId(Long linkedProblemId) { this.linkedProblemId = linkedProblemId; }
    public Long getLinkedTransportRequestId() { return linkedTransportRequestId; }
    public void setLinkedTransportRequestId(Long linkedTransportRequestId) { this.linkedTransportRequestId = linkedTransportRequestId; }
    public Long getLinkedCropOrderId() { return linkedCropOrderId; }
    public void setLinkedCropOrderId(Long linkedCropOrderId) { this.linkedCropOrderId = linkedCropOrderId; }
    public Long getLinkedBookingId() { return linkedBookingId; }
    public void setLinkedBookingId(Long linkedBookingId) { this.linkedBookingId = linkedBookingId; }
}
