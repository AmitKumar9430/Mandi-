package com.mandi.booking.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class RescheduleBookingRequest {

    @NotNull(message = "Proposed date is required")
    private LocalDate suggestedDate;

    @NotNull(message = "Proposed start time is required")
    private LocalTime suggestedStartTime;

    @NotNull(message = "Proposed end time is required")
    private LocalTime suggestedEndTime;

    private String reason;

    public RescheduleBookingRequest() {}

    public LocalDate getSuggestedDate() { return suggestedDate; }
    public void setSuggestedDate(LocalDate suggestedDate) { this.suggestedDate = suggestedDate; }
    public LocalTime getSuggestedStartTime() { return suggestedStartTime; }
    public void setSuggestedStartTime(LocalTime suggestedStartTime) { this.suggestedStartTime = suggestedStartTime; }
    public LocalTime getSuggestedEndTime() { return suggestedEndTime; }
    public void setSuggestedEndTime(LocalTime suggestedEndTime) { this.suggestedEndTime = suggestedEndTime; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
