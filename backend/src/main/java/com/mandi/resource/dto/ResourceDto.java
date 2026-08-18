package com.mandi.resource.dto;

import com.mandi.resource.Resource;
import com.mandi.resource.ResourceCategory;
import java.time.Instant;

public class ResourceDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private ResourceCategory category;
    private String description;
    private String locationName;
    private String villageOrTown;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private boolean available;
    private boolean verified;
    private String termsConditions;
    private String capacityOrQuantity;
    private Double costPerUnit;
    private String costUnit;
    private String contactPhone;
    private Double rating;
    private Integer totalReviews;
    private Integer successfulCasesCount;
    private Instant createdAt;

    public ResourceDto() {}

    public static ResourceDto from(Resource resource) {
        ResourceDto dto = new ResourceDto();
        dto.setId(resource.getId());
        if (resource.getOwner() != null) {
            dto.setOwnerId(resource.getOwner().getId());
            dto.setOwnerName(resource.getOwner().getFullName());
        }
        dto.setName(resource.getName());
        dto.setCategory(resource.getCategory());
        dto.setDescription(resource.getDescription());
        dto.setLocationName(resource.getLocationName());
        dto.setVillageOrTown(resource.getVillageOrTown());
        dto.setDistrict(resource.getDistrict());
        dto.setState(resource.getState());
        dto.setLatitude(resource.getLatitude());
        dto.setLongitude(resource.getLongitude());
        dto.setAvailable(resource.isAvailable());
        dto.setVerified(resource.isVerified());
        dto.setTermsConditions(resource.getTermsConditions());
        dto.setCapacityOrQuantity(resource.getCapacityOrQuantity());
        dto.setCostPerUnit(resource.getCostPerUnit());
        dto.setCostUnit(resource.getCostUnit());
        dto.setContactPhone(resource.getContactPhone());
        dto.setRating(resource.getRating());
        dto.setTotalReviews(resource.getTotalReviews());
        dto.setSuccessfulCasesCount(resource.getSuccessfulCasesCount());
        dto.setCreatedAt(resource.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ResourceCategory getCategory() { return category; }
    public void setCategory(ResourceCategory category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public String getVillageOrTown() { return villageOrTown; }
    public void setVillageOrTown(String villageOrTown) { this.villageOrTown = villageOrTown; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public String getTermsConditions() { return termsConditions; }
    public void setTermsConditions(String termsConditions) { this.termsConditions = termsConditions; }
    public String getCapacityOrQuantity() { return capacityOrQuantity; }
    public void setCapacityOrQuantity(String capacityOrQuantity) { this.capacityOrQuantity = capacityOrQuantity; }
    public Double getCostPerUnit() { return costPerUnit; }
    public void setCostPerUnit(Double costPerUnit) { this.costPerUnit = costPerUnit; }
    public String getCostUnit() { return costUnit; }
    public void setCostUnit(String costUnit) { this.costUnit = costUnit; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    public Integer getSuccessfulCasesCount() { return successfulCasesCount; }
    public void setSuccessfulCasesCount(Integer successfulCasesCount) { this.successfulCasesCount = successfulCasesCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
