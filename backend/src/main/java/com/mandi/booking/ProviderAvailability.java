package com.mandi.booking;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mandi.common.BaseEntity;
import com.mandi.problem.ServiceType;
import com.mandi.resource.Resource;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "provider_availabilities", indexes = {
        @Index(name = "idx_avail_provider", columnList = "provider_user_id"),
        @Index(name = "idx_avail_date", columnList = "available_date"),
        @Index(name = "idx_avail_service", columnList = "service_type")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProviderAvailability extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_user_id", nullable = false)
    private User provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ServiceType serviceType;

    @Column(name = "available_date", nullable = false)
    private LocalDate availableDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private boolean isBlocked = false;

    private Double hourlyRate;
    private Double dailyRate;
    private Double maxTravelRadiusKm = 25.0;

    @Column(length = 200)
    private String notes;

    public ProviderAvailability() {}

    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
    public ServiceType getServiceType() { return serviceType; }
    public void setServiceType(ServiceType serviceType) { this.serviceType = serviceType; }
    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public boolean isBlocked() { return isBlocked; }
    public void setBlocked(boolean blocked) { isBlocked = blocked; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }
    public Double getMaxTravelRadiusKm() { return maxTravelRadiusKm; }
    public void setMaxTravelRadiusKm(Double maxTravelRadiusKm) { this.maxTravelRadiusKm = maxTravelRadiusKm; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
