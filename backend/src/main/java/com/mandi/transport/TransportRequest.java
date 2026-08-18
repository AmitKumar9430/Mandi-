package com.mandi.transport;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "transport_requests", indexes = {
        @Index(name = "idx_tr_requester", columnList = "requester_user_id"),
        @Index(name = "idx_tr_status", columnList = "status"),
        @Index(name = "idx_tr_date", columnList = "requiredDate"),
        @Index(name = "idx_tr_pickup_dist", columnList = "pickupDistrict")
})
public class TransportRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_user_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_vehicle_id")
    private Vehicle assignedVehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_provider_id")
    private User assignedProvider;

    @Column(nullable = false, length = 100)
    private String cargoType; // Wheat, Rice, Agri Produce, Fertilizer, Household Goods, Sand/Building Material

    @Column(length = 500)
    private String cargoDescription;

    private Double quantityQuintals;
    private Double weightTons;

    // Pickup Details
    @Column(length = 100)
    private String pickupVillage;

    @Column(length = 100)
    private String pickupBlock;

    @Column(nullable = false, length = 100)
    private String pickupDistrict;

    @Column(nullable = false, length = 60)
    private String pickupState;

    private Double pickupLatitude;
    private Double pickupLongitude;

    // Destination Details
    @Column(length = 100)
    private String destinationVillage;

    @Column(length = 100)
    private String destinationBlock;

    @Column(nullable = false, length = 100)
    private String destinationDistrict;

    @Column(nullable = false, length = 60)
    private String destinationState;

    private Double destinationLatitude;
    private Double destinationLongitude;

    @Column(nullable = false)
    private LocalDate requiredDate;

    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private VehicleType preferredVehicleType;

    private Double requiredCapacityTons;

    private boolean driverRequired = true;
    private boolean loadingRequired = false;
    private boolean unloadingRequired = false;

    private Double budgetAmount;
    private Double agreedPrice;
    private Double counterPrice;

    @Column(length = 300)
    private String counterNotes;

    @Column(nullable = false, length = 40)
    private String status = "REQUESTED"; // REQUESTED, MATCHED, PROVIDER_ACCEPTED, CONFIRMED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(length = 500)
    private String specialInstructions;

    @Column(length = 50)
    private String contactPhone;

    private Long linkedBookingId;
    private Long linkedCropOrderId;

    public TransportRequest() {}

    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }

    public Vehicle getAssignedVehicle() { return assignedVehicle; }
    public void setAssignedVehicle(Vehicle assignedVehicle) { this.assignedVehicle = assignedVehicle; }

    public User getAssignedProvider() { return assignedProvider; }
    public void setAssignedProvider(User assignedProvider) { this.assignedProvider = assignedProvider; }

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

    public Double getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(Double agreedPrice) { this.agreedPrice = agreedPrice; }

    public Double getCounterPrice() { return counterPrice; }
    public void setCounterPrice(Double counterPrice) { this.counterPrice = counterPrice; }

    public String getCounterNotes() { return counterNotes; }
    public void setCounterNotes(String counterNotes) { this.counterNotes = counterNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public Long getLinkedBookingId() { return linkedBookingId; }
    public void setLinkedBookingId(Long linkedBookingId) { this.linkedBookingId = linkedBookingId; }

    public Long getLinkedCropOrderId() { return linkedCropOrderId; }
    public void setLinkedCropOrderId(Long linkedCropOrderId) { this.linkedCropOrderId = linkedCropOrderId; }
}
