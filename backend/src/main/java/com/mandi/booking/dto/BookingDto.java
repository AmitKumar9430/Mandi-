package com.mandi.booking.dto;

import com.mandi.booking.Booking;
import com.mandi.booking.BookingStatus;
import com.mandi.problem.ServiceType;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingDto {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterPhone;
    private Long providerId;
    private String providerName;
    private String providerPhone;
    private Long problemId;
    private String problemTitle;
    private Long resourceId;
    private String resourceName;
    private ServiceType serviceType;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Double agreedPrice;
    private String priceUnit;
    private BookingStatus bookingStatus;
    private String serviceAddress;
    private String villageOrTown;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private String notes;
    private boolean requesterConfirmed;
    private boolean providerDelivered;
    private LocalDate rescheduleSuggestedDate;
    private LocalTime rescheduleSuggestedStartTime;
    private LocalTime rescheduleSuggestedEndTime;
    private String rescheduleReason;
    private String rejectionReason;
    private Instant createdAt;

    public BookingDto() {}

    public static BookingDto from(Booking b) {
        if (b == null) return null;
        BookingDto dto = new BookingDto();
        dto.setId(b.getId());
        if (b.getRequester() != null) {
            dto.setRequesterId(b.getRequester().getId());
            dto.setRequesterName(b.getRequester().getFullName());
            dto.setRequesterPhone(b.getRequester().getPhone());
        }
        if (b.getProvider() != null) {
            dto.setProviderId(b.getProvider().getId());
            dto.setProviderName(b.getProvider().getFullName());
            dto.setProviderPhone(b.getProvider().getPhone());
        }
        if (b.getProblem() != null) {
            dto.setProblemId(b.getProblem().getId());
            dto.setProblemTitle(b.getProblem().getTitle());
        }
        if (b.getResource() != null) {
            dto.setResourceId(b.getResource().getId());
            dto.setResourceName(b.getResource().getName());
        }
        dto.setServiceType(b.getServiceType());
        dto.setBookingDate(b.getBookingDate());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setAgreedPrice(b.getAgreedPrice());
        dto.setPriceUnit(b.getPriceUnit());
        dto.setBookingStatus(b.getBookingStatus());
        dto.setServiceAddress(b.getServiceAddress());
        dto.setVillageOrTown(b.getVillageOrTown());
        dto.setDistrict(b.getDistrict());
        dto.setState(b.getState());
        dto.setLatitude(b.getLatitude());
        dto.setLongitude(b.getLongitude());
        dto.setContactPhone(b.getContactPhone());
        dto.setNotes(b.getNotes());
        dto.setRequesterConfirmed(b.isRequesterConfirmed());
        dto.setProviderDelivered(b.isProviderDelivered());
        dto.setRescheduleSuggestedDate(b.getRescheduleSuggestedDate());
        dto.setRescheduleSuggestedStartTime(b.getRescheduleSuggestedStartTime());
        dto.setRescheduleSuggestedEndTime(b.getRescheduleSuggestedEndTime());
        dto.setRescheduleReason(b.getRescheduleReason());
        dto.setRejectionReason(b.getRejectionReason());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
    public String getRequesterPhone() { return requesterPhone; }
    public void setRequesterPhone(String requesterPhone) { this.requesterPhone = requesterPhone; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getProviderPhone() { return providerPhone; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public String getProblemTitle() { return problemTitle; }
    public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }
    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }
    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }
    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Double getAgreedPrice() { return agreedPrice; }
    public void setAgreedPrice(Double agreedPrice) { this.agreedPrice = agreedPrice; }
    public String getPriceUnit() { return priceUnit; }
    public void setPriceUnit(String priceUnit) { this.priceUnit = priceUnit; }
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
    public String getServiceAddress() { return serviceAddress; }
    public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }
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
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public boolean isRequesterConfirmed() { return requesterConfirmed; }
    public void setRequesterConfirmed(boolean requesterConfirmed) { this.requesterConfirmed = requesterConfirmed; }
    public boolean isProviderDelivered() { return providerDelivered; }
    public void setProviderDelivered(boolean providerDelivered) { this.providerDelivered = providerDelivered; }
    public LocalDate getRescheduleSuggestedDate() { return rescheduleSuggestedDate; }
    public void setRescheduleSuggestedDate(LocalDate rescheduleSuggestedDate) { this.rescheduleSuggestedDate = rescheduleSuggestedDate; }
    public LocalTime getRescheduleSuggestedStartTime() { return rescheduleSuggestedStartTime; }
    public void setRescheduleSuggestedStartTime(LocalTime rescheduleSuggestedStartTime) { this.rescheduleSuggestedStartTime = rescheduleSuggestedStartTime; }
    public LocalTime getRescheduleSuggestedEndTime() { return rescheduleSuggestedEndTime; }
    public void setRescheduleSuggestedEndTime(LocalTime rescheduleSuggestedEndTime) { this.rescheduleSuggestedEndTime = rescheduleSuggestedEndTime; }
    public String getRescheduleReason() { return rescheduleReason; }
    public void setRescheduleReason(String rescheduleReason) { this.rescheduleReason = rescheduleReason; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
