package com.mandi.booking;

public enum BookingStatus {
    PENDING,            // Requester submitted booking request to provider
    ACCEPTED,           // Provider accepted date/time and terms
    REJECTED,           // Provider rejected
    RESCHEDULED,        // Provider or Requester proposed alternate time
    IN_PROGRESS,        // Service underway
    SERVICE_DELIVERED,  // Provider marked service as delivered
    CONFIRMED,          // Requester confirmed delivery
    COMPLETED,          // Completed and closed
    CANCELLED           // Cancelled before start
}
