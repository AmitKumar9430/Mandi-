package com.mandi.agriculture.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class CreateCropRequest {

    @NotBlank(message = "Crop name is required")
    private String cropName;

    private String variety;

    @NotNull(message = "Quantity in quintals is required")
    @Positive(message = "Quantity must be greater than 0")
    private Double quantityQuintals;

    @NotNull(message = "Expected price per quintal is required")
    @Positive(message = "Price must be greater than 0")
    private Double expectedPricePerQuintal;

    private LocalDate harvestDate;
    private String qualityGrade;
    private String villageOrTown;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String description;
    private String contactPhone;

    public CreateCropRequest() {}

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }
    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }
    public Double getExpectedPricePerQuintal() { return expectedPricePerQuintal; }
    public void setExpectedPricePerQuintal(Double expectedPricePerQuintal) { this.expectedPricePerQuintal = expectedPricePerQuintal; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public String getQualityGrade() { return qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }
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
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
