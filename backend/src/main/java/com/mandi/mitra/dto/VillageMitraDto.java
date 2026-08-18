package com.mandi.mitra.dto;

import com.mandi.mitra.VillageMitraProfile;

public class VillageMitraDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String assignedVillages;
    private String assignedBlock;
    private String assignedDistrict;
    private String assignedState;
    private Double latitude;
    private Double longitude;
    private String status;
    private String servicesOffered;
    private Double rating;
    private Integer totalCoordinatedCases;
    private String photoUrl;
    private String bio;
    private Double distanceKm;

    public static VillageMitraDto fromEntity(VillageMitraProfile p) {
        if (p == null) return null;
        VillageMitraDto dto = new VillageMitraDto();
        dto.setId(p.getId());
        if (p.getUser() != null) {
            dto.setUserId(p.getUser().getId());
        }
        dto.setFullName(p.getFullName());
        dto.setPhone(p.getPhone());
        dto.setAssignedVillages(p.getAssignedVillages());
        dto.setAssignedBlock(p.getAssignedBlock());
        dto.setAssignedDistrict(p.getAssignedDistrict());
        dto.setAssignedState(p.getAssignedState());
        dto.setLatitude(p.getLatitude());
        dto.setLongitude(p.getLongitude());
        dto.setStatus(p.getStatus());
        dto.setServicesOffered(p.getServicesOffered());
        dto.setRating(p.getRating());
        dto.setTotalCoordinatedCases(p.getTotalCoordinatedCases());
        dto.setPhotoUrl(p.getPhotoUrl());
        dto.setBio(p.getBio());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAssignedVillages() { return assignedVillages; }
    public void setAssignedVillages(String assignedVillages) { this.assignedVillages = assignedVillages; }
    public String getAssignedBlock() { return assignedBlock; }
    public void setAssignedBlock(String assignedBlock) { this.assignedBlock = assignedBlock; }
    public String getAssignedDistrict() { return assignedDistrict; }
    public void setAssignedDistrict(String assignedDistrict) { this.assignedDistrict = assignedDistrict; }
    public String getAssignedState() { return assignedState; }
    public void setAssignedState(String assignedState) { this.assignedState = assignedState; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getServicesOffered() { return servicesOffered; }
    public void setServicesOffered(String servicesOffered) { this.servicesOffered = servicesOffered; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getTotalCoordinatedCases() { return totalCoordinatedCases; }
    public void setTotalCoordinatedCases(Integer totalCoordinatedCases) { this.totalCoordinatedCases = totalCoordinatedCases; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}
