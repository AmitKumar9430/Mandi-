package com.mandi.transport.dto;

import com.mandi.transport.VehicleType;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateTransportRequest {
    private String cargoType;
    private String cargoDescription;
    private Double quantityQuintals;
    private Double weightTons;
    private String pickupVillage;
    private String pickupBlock;
    private String pickupDistrict;
    private String pickupState;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String destinationVillage;
    private String destinationBlock;
    private String destinationDistrict;
    private String destinationState;
    private Double destinationLatitude;
    private Double destinationLongitude;
    private LocalDate requiredDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private VehicleType preferredVehicleType;
    private Double requiredCapacityTons;
    private boolean driverRequired = true;
    private boolean loadingRequired = false;
    private boolean unloadingRequired = false;
    private Double budgetAmount;
    private String specialInstructions;
    private String contactPhone;
    private Long linkedCropOrderId;

    public String getCargoType() { return cargoType; }
    public void setCargoType(String cargoType) { this.cargoType = cargoType; }
    public String getCargoDescription() { return cargoDescription; }
    public void setCargoDescription(String cargoDescription) { this.cargoDescription = cargoDescription; }
    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }
    public Double getWeightTons() { return weightTons; }
    public void setWeightTons(Double weightTons) { this.weightTons = weightTons; }
    public String getPickupVillage() { return pickupVillage; }
    public void setPickupVillage(String pickupVillage) { this.pickupVillage = pickupVillage; }
    public String getPickupBlock() { return pickupBlock; }
    public void setPickupBlock(String pickupBlock) { this.pickupBlock = pickupBlock; }
    public String getPickupDistrict() { return pickupDistrict; }
    public void setPickupDistrict(String pickupDistrict) { this.pickupDistrict = pickupDistrict; }
    public String getPickupState() { return pickupState; }
    public void setPickupState(String pickupState) { this.pickupState = pickupState; }
    public Double getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }
    public Double getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }
    public String getDestinationVillage() { return destinationVillage; }
    public void setDestinationVillage(String destinationVillage) { this.destinationVillage = destinationVillage; }
    public String getDestinationBlock() { return destinationBlock; }
    public void setDestinationBlock(String destinationBlock) { this.destinationBlock = destinationBlock; }
    public String getDestinationDistrict() { return destinationDistrict; }
    public void setDestinationDistrict(String destinationDistrict) { this.destinationDistrict = destinationDistrict; }
    public String getDestinationState() { return destinationState; }
    public void setDestinationState(String destinationState) { this.destinationState = destinationState; }
    public Double getDestinationLatitude() { return destinationLatitude; }
    public void setDestinationLatitude(Double destinationLatitude) { this.destinationLatitude = destinationLatitude; }
    public Double getDestinationLongitude() { return destinationLongitude; }
    public void setDestinationLongitude(Double destinationLongitude) { this.destinationLongitude = destinationLongitude; }
    public LocalDate getRequiredDate() { return requiredDate; }
    public void setRequiredDate(LocalDate requiredDate) { this.requiredDate = requiredDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public VehicleType getPreferredVehicleType() { return preferredVehicleType; }
    public void setPreferredVehicleType(VehicleType preferredVehicleType) { this.preferredVehicleType = preferredVehicleType; }
    public Double getRequiredCapacityTons() { return requiredCapacityTons; }
    public void setRequiredCapacityTons(Double requiredCapacityTons) { this.requiredCapacityTons = requiredCapacityTons; }
    public boolean isDriverRequired() { return driverRequired; }
    public void setDriverRequired(boolean driverRequired) { this.driverRequired = driverRequired; }
    public boolean isLoadingRequired() { return loadingRequired; }
    public void setLoadingRequired(boolean loadingRequired) { this.loadingRequired = loadingRequired; }
    public boolean isUnloadingRequired() { return unloadingRequired; }
    public void setUnloadingRequired(boolean unloadingRequired) { this.unloadingRequired = unloadingRequired; }
    public Double getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(Double budgetAmount) { this.budgetAmount = budgetAmount; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public Long getLinkedCropOrderId() { return linkedCropOrderId; }
    public void setLinkedCropOrderId(Long linkedCropOrderId) { this.linkedCropOrderId = linkedCropOrderId; }
}
