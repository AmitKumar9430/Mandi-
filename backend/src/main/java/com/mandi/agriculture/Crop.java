package com.mandi.agriculture;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "crops", indexes = {
        @Index(name = "idx_crop_farmer", columnList = "farmer_user_id"),
        @Index(name = "idx_crop_status", columnList = "status")
})
public class Crop extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_user_id", nullable = false)
    private User farmer;

    @Column(nullable = false, length = 100)
    private String cropName; // e.g. Wheat (Gehu), Paddy (Dhan), Mustard (Sarson), Potato (Aloo)

    @Column(length = 100)
    private String variety; // e.g. Sharbati, HD-2967, Pusa 1121

    @Column(nullable = false)
    private Double quantityQuintals;

    @Column(nullable = false)
    private Double expectedPricePerQuintal;

    private LocalDate harvestDate;

    @Column(length = 50)
    private String qualityGrade; // Grade A, Grade B, Organic

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district;

    @Column(length = 50)
    private String state;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, UNDER_NEGOTIATION, SOLD, EXPIRED

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String contactPhone;

    public Crop() {}

    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }
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
}
