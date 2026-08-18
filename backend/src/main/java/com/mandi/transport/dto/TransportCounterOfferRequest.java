package com.mandi.transport.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class TransportCounterOfferRequest {
    private Double counterPrice;
    private LocalDate counterDate;
    private LocalTime counterStartTime;
    private LocalTime counterEndTime;
    private String notes;

    public Double getCounterPrice() { return counterPrice; }
    public void setCounterPrice(Double counterPrice) { this.counterPrice = counterPrice; }
    public LocalDate getCounterDate() { return counterDate; }
    public void setCounterDate(LocalDate counterDate) { this.counterDate = counterDate; }
    public LocalTime getCounterStartTime() { return counterStartTime; }
    public void setCounterStartTime(LocalTime counterStartTime) { this.counterStartTime = counterStartTime; }
    public LocalTime getCounterEndTime() { return counterEndTime; }
    public void setCounterEndTime(LocalTime counterEndTime) { this.counterEndTime = counterEndTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
