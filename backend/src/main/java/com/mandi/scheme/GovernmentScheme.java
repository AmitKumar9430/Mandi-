package com.mandi.scheme;

import com.mandi.common.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "government_schemes", indexes = {
        @Index(name = "idx_scheme_category", columnList = "category"),
        @Index(name = "idx_scheme_demo", columnList = "is_demo_data")
})
public class GovernmentScheme extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name; // e.g. PM-Kisan Samman Nidhi, Ayushman Bharat PM-JAY

    @Column(nullable = false, length = 100)
    private String category; // AGRICULTURE, HEALTHCARE, HOUSING, EDUCATION, SOCIAL_SECURITY

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 2000)
    private String eligibilityCriteria; // e.g. Small & marginal farmers with cultivable land up to 2 hectares

    @Column(nullable = false, length = 2000)
    private String benefits; // e.g. ₹6,000 per year in 3 equal installments

    @Column(length = 1500)
    private String requiredDocuments; // Aadhaar card, Bank passbook, Land records (Khasra/Khatauni)

    @Column(length = 500)
    private String applicationMethod; // Online via pmkisan.gov.in or CSC Center

    @Column(length = 500)
    private String officialSourceUrl;

    @Column(name = "is_demo_data", nullable = false)
    private boolean isDemoData = false;

    private LocalDate lastVerifiedDate;

    public GovernmentScheme() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public String getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(String requiredDocuments) { this.requiredDocuments = requiredDocuments; }
    public String getApplicationMethod() { return applicationMethod; }
    public void setApplicationMethod(String applicationMethod) { this.applicationMethod = applicationMethod; }
    public String getOfficialSourceUrl() { return officialSourceUrl; }
    public void setOfficialSourceUrl(String officialSourceUrl) { this.officialSourceUrl = officialSourceUrl; }
    public boolean isDemoData() { return isDemoData; }
    public void setDemoData(boolean demoData) { isDemoData = demoData; }
    public LocalDate getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(LocalDate lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }
}
