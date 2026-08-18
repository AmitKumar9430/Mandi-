package com.mandi.transport.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class VehicleAvailabilityRequest {
    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status = "AVAILABLE"; // AVAILABLE, BLOCKED, MAINTENANCE, HOLIDAY
    private Double overridePrice;
    private String priceUnit;
    private String notes;

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
}
