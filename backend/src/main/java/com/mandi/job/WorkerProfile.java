package com.mandi.job;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "worker_profiles", indexes = {
        @Index(name = "idx_worker_user", columnList = "user_id", unique = true)
})
public class WorkerProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 200)
    private String primarySkills; // Mason, Painting, Plumbing, Tractor Driving

    private Integer experienceYears = 1;
    private Double dailyWageExpected;

    @Column(nullable = false)
    private boolean available = true;

    @Column(length = 500)
    private String bio;

    public WorkerProfile() {}

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getPrimarySkills() { return primarySkills; }
    public void setPrimarySkills(String primarySkills) { this.primarySkills = primarySkills; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Double getDailyWageExpected() { return dailyWageExpected; }
    public void setDailyWageExpected(Double dailyWageExpected) { this.dailyWageExpected = dailyWageExpected; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
