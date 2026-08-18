package com.mandi.booking;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mandi.common.BaseEntity;
import com.mandi.problem.Problem;
import com.mandi.problem.ServiceType;
import com.mandi.resource.Resource;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_provider", columnList = "provider_user_id"),
        @Index(name = "idx_booking_requester", columnList = "requester_user_id"),
        @Index(name = "idx_booking_date", columnList = "booking_date"),
        @Index(name = "idx_booking_status", columnList = "booking_status"),
        @Index(name = "idx_booking_collision", columnList = "provider_user_id, booking_date, booking_status")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_user_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private User provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ServiceType serviceType;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    private Double agreedPrice;

    @Column(length = 50)
    private String priceUnit = "per hour";

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 30)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    // Location of service delivery
    @Column(length = 200)
    private String serviceAddress;

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district;

    @Column(length = 50)
    private String state;

    private Double latitude;
    private Double longitude;

    @Column(length = 30)
    private String contactPhone;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private boolean requesterConfirmed = false;

    @Column(nullable = false)
    private boolean providerDelivered = false;

    // Rescheduling negotiation
    private LocalDate rescheduleSuggestedDate;
    private LocalTime rescheduleSuggestedStartTime;
    private LocalTime rescheduleSuggestedEndTime;

    @Column(length = 500)
    private String rescheduleReason;

    @Column(length = 500)
    private String rejectionReason;

    public Booking() {}

    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }
    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
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
}
