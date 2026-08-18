package com.mandi.transport.dto;

import com.mandi.transport.VehicleType;

public class CreateVehicleRequest {
    private VehicleType vehicleType;
    private String registrationNumber;
    private String modelName;
    private Double capacityTons;
    private Double capacityQuintals;
    private boolean driverAvailable = true;
    private boolean ownerDriver = true;
    private Double basePrice;
    private Double pricePerKm;
    private Double pricePerHour;
    private Double pricePerTrip;
    private Double pricePerDay;
    private Double loadingCharge;
    private Double unloadingCharge;
    private Integer maxTravelRadiusKm = 40;
    private String serviceVillage;
    private String serviceBlock;
    private String serviceDistrict;
    private String serviceState;
    private Double latitude;
    private Double longitude;
    private String photoUrl;

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
}
