package com.mandi.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "resources", indexes = {
        @Index(name = "idx_resource_category", columnList = "category"),
        @Index(name = "idx_resource_available", columnList = "available"),
        @Index(name = "idx_resource_location", columnList = "latitude, longitude")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Resource extends BaseEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ResourceCategory category;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String locationName;

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district;

    @Column(length = 50)
    private String state;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(length = 500)
    private String termsConditions;

    @Column(length = 100)
    private String capacityOrQuantity;

    private Double costPerUnit; // 0 for free/volunteer/community

    @Column(length = 50)
    private String costUnit; // "per hour", "per day", "free", "per quintal"

    @Column(length = 50)
    private String contactPhone;

    private Double rating = 5.0;
    private Integer totalReviews = 0;
    private Integer successfulCasesCount = 0;

    public Resource() {}

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
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
}
