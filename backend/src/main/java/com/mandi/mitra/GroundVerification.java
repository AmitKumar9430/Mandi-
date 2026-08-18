package com.mandi.mitra;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ground_verifications", indexes = {
        @Index(name = "idx_gv_mitra", columnList = "mitra_user_id"),
        @Index(name = "idx_gv_problem", columnList = "problem_id")
})
public class GroundVerification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mitra_user_id", nullable = false)
    private User mitra;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(nullable = false, length = 40)
    private String verificationStatus; // VERIFIED, NOT_VERIFIED, PARTIALLY_VERIFIED, UNABLE_TO_VERIFY

    @Column(nullable = false, length = 1500)
    private String observationNotes;

    @Column(length = 500)
    private String evidencePhotoUrl;

    private Double latitude;
    private Double longitude;

    @Column(length = 100)
    private String locationAddress;

    private LocalDateTime verifiedAt = LocalDateTime.now();

    public GroundVerification() {}

    public User getMitra() { return mitra; }
    public void setMitra(User mitra) { this.mitra = mitra; }

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getObservationNotes() { return observationNotes; }
    public void setObservationNotes(String observationNotes) { this.observationNotes = observationNotes; }

    public String getEvidencePhotoUrl() { return evidencePhotoUrl; }
    public void setEvidencePhotoUrl(String evidencePhotoUrl) { this.evidencePhotoUrl = evidencePhotoUrl; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}
