package com.mandi.transport;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicles", indexes = {
        @Index(name = "idx_vehicle_provider", columnList = "provider_user_id"),
        @Index(name = "idx_vehicle_type", columnList = "vehicleType"),
        @Index(name = "idx_vehicle_district", columnList = "serviceDistrict"),
        @Index(name = "idx_vehicle_active", columnList = "active")
})
public class Vehicle extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private User provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private VehicleType vehicleType;

    @Column(nullable = false, length = 50)
    private String registrationNumber; // e.g. UP32-AB-1234, PB65-C-9876

    @Column(length = 100)
    private String modelName; // e.g. Mahindra 575 DI, Tata Ace Gold, Bolero Maxi Truck

    private Double capacityTons;      // e.g. 5.0 Tons
    private Double capacityQuintals;  // e.g. 50 Quintals

    private boolean driverAvailable = true;
    private boolean ownerDriver = true;

    // Pricing models
    private Double basePrice;        // Base minimum charge
    private Double pricePerKm;       // ₹ per KM
    private Double pricePerHour;     // ₹ per Hour
    private Double pricePerTrip;     // ₹ per Trip
    private Double pricePerDay;      // ₹ per Day
    private Double loadingCharge;    // ₹ loading
    private Double unloadingCharge;  // ₹ unloading

    private Integer maxTravelRadiusKm = 40; // Default 40 km radius

    // Base Location / Service Area
    @Column(length = 100)
    private String serviceVillage;

    @Column(length = 100)
    private String serviceBlock;

    @Column(nullable = false, length = 100)
    private String serviceDistrict;

    @Column(nullable = false, length = 60)
    private String serviceState;

    private Double latitude;
    private Double longitude;

    @Column(length = 500)
    private String photoUrl;

    @Column(length = 500)
    private String documentUrl;

    @Column(length = 30)
    private String verificationStatus = "VERIFIED"; // VERIFIED, PENDING, UNVERIFIED

    private Double rating = 4.8;
    private Integer totalCompletedTrips = 0;

    private boolean active = true;

    public Vehicle() {}

    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public Double getCapacityTons() { return capacityTons; }
    public void setCapacityTons(Double capacityTons) { this.capacityTons = capacityTons; }

    public Double getCapacityQuintals() { return capacityQuintals; }
    public void setCapacityQuintals(Double capacityQuintals) { this.capacityQuintals = capacityQuintals; }

    public boolean isDriverAvailable() { return driverAvailable; }
    public void setDriverAvailable(boolean driverAvailable) { this.driverAvailable = driverAvailable; }

    public boolean isOwnerDriver() { return ownerDriver; }
    public void setOwnerDriver(boolean ownerDriver) { this.ownerDriver = ownerDriver; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Double getPricePerKm() { return pricePerKm; }
    public void setPricePerKm(Double pricePerKm) { this.pricePerKm = pricePerKm; }

    public Double getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(Double pricePerHour) { this.pricePerHour = pricePerHour; }

    public Double getPricePerTrip() { return pricePerTrip; }
    public void setPricePerTrip(Double pricePerTrip) { this.pricePerTrip = pricePerTrip; }

    public Double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(Double pricePerDay) { this.pricePerDay = pricePerDay; }

    public Double getLoadingCharge() { return loadingCharge; }
    public void setLoadingCharge(Double loadingCharge) { this.loadingCharge = loadingCharge; }

    public Double getUnloadingCharge() { return unloadingCharge; }
    public void setUnloadingCharge(Double unloadingCharge) { this.unloadingCharge = unloadingCharge; }

    public Integer getMaxTravelRadiusKm() { return maxTravelRadiusKm; }
    public void setMaxTravelRadiusKm(Integer maxTravelRadiusKm) { this.maxTravelRadiusKm = maxTravelRadiusKm; }

    public String getServiceVillage() { return serviceVillage; }
    public void setServiceVillage(String serviceVillage) { this.serviceVillage = serviceVillage; }

    public String getServiceBlock() { return serviceBlock; }
    public void setServiceBlock(String serviceBlock) { this.serviceBlock = serviceBlock; }

    public String getServiceDistrict() { return serviceDistrict; }
    public void setServiceDistrict(String serviceDistrict) { this.serviceDistrict = serviceDistrict; }

    public String getServiceState() { return serviceState; }
    public void setServiceState(String serviceState) { this.serviceState = serviceState; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalCompletedTrips() { return totalCompletedTrips; }
    public void setTotalCompletedTrips(Integer totalCompletedTrips) { this.totalCompletedTrips = totalCompletedTrips; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
