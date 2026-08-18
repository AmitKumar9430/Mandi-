package com.mandi.job;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "time_bank_entries", indexes = {
        @Index(name = "idx_timebank_user", columnList = "user_id")
})
public class TimeBankEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String skillOffered; // e.g. Computer Help, Math Tutoring, Motorcycle Repair, Form Filling

    @Column(nullable = false)
    private Double hoursAvailablePerWeek = 2.0;

    @Column(length = 500)
    private String availabilitySchedule; // e.g. Sunday Morning, Evenings after 6 PM

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    private Integer hoursContributedTotal = 0;

    public TimeBankEntry() {}

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSkillOffered() { return skillOffered; }
    public void setSkillOffered(String skillOffered) { this.skillOffered = skillOffered; }
    public Double getHoursAvailablePerWeek() { return hoursAvailablePerWeek; }
    public void setHoursAvailablePerWeek(Double hoursAvailablePerWeek) { this.hoursAvailablePerWeek = hoursAvailablePerWeek; }
    public String getAvailabilitySchedule() { return availabilitySchedule; }
    public void setAvailabilitySchedule(String availabilitySchedule) { this.availabilitySchedule = availabilitySchedule; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Integer getHoursContributedTotal() { return hoursContributedTotal; }
    public void setHoursContributedTotal(Integer hoursContributedTotal) { this.hoursContributedTotal = hoursContributedTotal; }
}
