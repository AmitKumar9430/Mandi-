package com.mandi.resource.dto;

import com.mandi.resource.ResourceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateResourceRequest {

    @NotBlank(message = "Resource name is required")
    @Size(min = 3, max = 150)
    private String name;

    @NotNull(message = "Resource category is required")
    private ResourceCategory category;

    private String description;
    private String locationName;
    private String villageOrTown;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String termsConditions;
    private String capacityOrQuantity;
    private Double costPerUnit;
    private String costUnit;
    private String contactPhone;

    public CreateResourceRequest() {}

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
}
