package com.mandi.job;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "skill_exchanges")
public class SkillExchange extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String skillOffered; // e.g. Motorcycle Repair

    @Column(nullable = false, length = 100)
    private String skillNeeded; // e.g. English Tutoring

    @Column(length = 500)
    private String terms;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, MATCHED, COMPLETED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_user_id")
    private User matchedUser;

    public SkillExchange() {}

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSkillOffered() { return skillOffered; }
    public void setSkillOffered(String skillOffered) { this.skillOffered = skillOffered; }
    public String getSkillNeeded() { return skillNeeded; }
    public void setSkillNeeded(String skillNeeded) { this.skillNeeded = skillNeeded; }
    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getMatchedUser() { return matchedUser; }
    public void setMatchedUser(User matchedUser) { this.matchedUser = matchedUser; }
}
