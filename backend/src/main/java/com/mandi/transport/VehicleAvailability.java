package com.mandi.transport;

import com.mandi.common.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "vehicle_availabilities", indexes = {
        @Index(name = "idx_va_vehicle_date", columnList = "vehicle_id, availableDate"),
        @Index(name = "idx_va_status", columnList = "status")
})
public class VehicleAvailability extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate availableDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, BOOKED, BLOCKED, MAINTENANCE, HOLIDAY

    private Double overridePrice;
    private String priceUnit; // per trip, per km, per hour

    @Column(length = 200)
    private String notes;

    private Long linkedBookingId;

    public VehicleAvailability() {}

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getOverridePrice() { return overridePrice; }
    public void setOverridePrice(Double overridePrice) { this.overridePrice = overridePrice; }

    public String getPriceUnit() { return priceUnit; }
    public void setPriceUnit(String priceUnit) { this.priceUnit = priceUnit; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getLinkedBookingId() { return linkedBookingId; }
    public void setLinkedBookingId(Long linkedBookingId) { this.linkedBookingId = linkedBookingId; }
}
