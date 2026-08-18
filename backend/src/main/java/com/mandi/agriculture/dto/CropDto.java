package com.mandi.agriculture.dto;

import com.mandi.agriculture.Crop;
import java.time.Instant;
import java.time.LocalDate;

public class CropDto {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String cropName;
    private String variety;
    private Double quantityQuintals;
    private Double expectedPricePerQuintal;
    private LocalDate harvestDate;
    private String qualityGrade;
    private String villageOrTown;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String status;
    private String description;
    private String contactPhone;
    private Instant createdAt;

    public CropDto() {}

    public static CropDto fromEntity(Crop crop) {
        return from(crop);
    }

    public static CropDto from(Crop crop) {
        CropDto dto = new CropDto();
        dto.setId(crop.getId());
        if (crop.getFarmer() != null) {
            dto.setFarmerId(crop.getFarmer().getId());
            dto.setFarmerName(crop.getFarmer().getFullName());
        }
        dto.setCropName(crop.getCropName());
        dto.setVariety(crop.getVariety());
        dto.setQuantityQuintals(crop.getQuantityQuintals());
        dto.setExpectedPricePerQuintal(crop.getExpectedPricePerQuintal());
        dto.setHarvestDate(crop.getHarvestDate());
        dto.setQualityGrade(crop.getQualityGrade());
        dto.setVillageOrTown(crop.getVillageOrTown());
        dto.setDistrict(crop.getDistrict());
        dto.setState(crop.getState());
        dto.setLatitude(crop.getLatitude());
        dto.setLongitude(crop.getLongitude());
        dto.setStatus(crop.getStatus());
        dto.setDescription(crop.getDescription());
        dto.setContactPhone(crop.getContactPhone());
        dto.setCreatedAt(crop.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
