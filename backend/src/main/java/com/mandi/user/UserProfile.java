package com.mandi.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mandi.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "user_profiles")
public class UserProfile extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String villageOrTown;

    @Column(length = 100)
    private String district;

    @Column(length = 50)
    private String state;

    @Column(length = 10)
    private String pincode;

    private Double latitude;
    private Double longitude;

    @Column(length = 10)
    private String preferredLanguage = "HI"; // HI or EN

    @Column(length = 500)
    private String bio;

    private Integer trustScore = 100;
    private Integer problemsResolvedCount = 0;
    private Integer sevaHoursContributed = 0;

    public UserProfile() {}

    public UserProfile(User user) {
        this.user = user;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getVillageOrTown() { return villageOrTown; }
    public void setVillageOrTown(String villageOrTown) { this.villageOrTown = villageOrTown; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
    public Integer getProblemsResolvedCount() { return problemsResolvedCount; }
    public void setProblemsResolvedCount(Integer problemsResolvedCount) { this.problemsResolvedCount = problemsResolvedCount; }
    public Integer getSevaHoursContributed() { return sevaHoursContributed; }
    public void setSevaHoursContributed(Integer sevaHoursContributed) { this.sevaHoursContributed = sevaHoursContributed; }
}
