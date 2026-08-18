package com.mandi.mitra;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "village_mitra_profiles", indexes = {
        @Index(name = "idx_mitra_user", columnList = "user_id"),
        @Index(name = "idx_mitra_district", columnList = "assignedDistrict"),
        @Index(name = "idx_mitra_block", columnList = "assignedBlock"),
        @Index(name = "idx_mitra_status", columnList = "status")
})
public class VillageMitraProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(length = 500)
    private String assignedVillages; // e.g. Gharuan, Kharar, Bodhgaya, Malihabad

    @Column(nullable = false, length = 100)
    private String assignedBlock;

    @Column(nullable = false, length = 100)
    private String assignedDistrict;

    @Column(nullable = false, length = 60)
    private String assignedState;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, ON_FIELD, BUSY, UNAVAILABLE

    @Column(length = 500)
    private String servicesOffered = "Agriculture Assistance, Transport Coordination, Crop Sales, Civic Resolution, Ground Verification";

    private Double rating = 4.9;
    private Integer totalCoordinatedCases = 0;

    @Column(length = 500)
    private String photoUrl;

    @Column(length = 500)
    private String bio;

    private boolean verified = true;
    private boolean active = true;

    public VillageMitraProfile() {}

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAssignedVillages() { return assignedVillages; }
    public void setAssignedVillages(String assignedVillages) { this.assignedVillages = assignedVillages; }

    public String getAssignedBlock() { return assignedBlock; }
    public void setAssignedBlock(String assignedBlock) { this.assignedBlock = assignedBlock; }

    public String getAssignedDistrict() { return assignedDistrict; }
    public void setAssignedDistrict(String assignedDistrict) { this.assignedDistrict = assignedDistrict; }

    public String getAssignedState() { return assignedState; }
    public void setAssignedState(String assignedState) { this.assignedState = assignedState; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getServicesOffered() { return servicesOffered; }
    public void setServicesOffered(String servicesOffered) { this.servicesOffered = servicesOffered; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalCoordinatedCases() { return totalCoordinatedCases; }
    public void setTotalCoordinatedCases(Integer totalCoordinatedCases) { this.totalCoordinatedCases = totalCoordinatedCases; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
