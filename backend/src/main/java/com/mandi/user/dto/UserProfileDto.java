package com.mandi.user.dto;

import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserProfile;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

public class UserProfileDto {
    private Long id;
    private String phone;
    private String email;
    private String fullName;
    private Set<String> roles;
    private boolean verified;
    private String villageOrTown;
    private String district;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String preferredLanguage;
    private String bio;
    private Integer trustScore;
    private Integer problemsResolvedCount;
    private Integer sevaHoursContributed;
    private Instant createdAt;

    public UserProfileDto() {}

    public static UserProfileDto from(User user, UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setPhone(user.getPhone());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRoles(user.getRoles().stream().map(Role::name).collect(Collectors.toSet()));
        dto.setVerified(user.isVerified());
        dto.setCreatedAt(user.getCreatedAt());

        if (profile != null) {
            dto.setVillageOrTown(profile.getVillageOrTown());
            dto.setDistrict(profile.getDistrict());
            dto.setState(profile.getState());
            dto.setPincode(profile.getPincode());
            dto.setLatitude(profile.getLatitude());
            dto.setLongitude(profile.getLongitude());
            dto.setPreferredLanguage(profile.getPreferredLanguage());
            dto.setBio(profile.getBio());
            dto.setTrustScore(profile.getTrustScore());
            dto.setProblemsResolvedCount(profile.getProblemsResolvedCount());
            dto.setSevaHoursContributed(profile.getSevaHoursContributed());
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
