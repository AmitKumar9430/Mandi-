package com.mandi.scheme;

import java.time.LocalDate;

public class SchemeDto {
    private Long id;
    private String name;
    private String category;
    private String description;
    private String eligibilityCriteria;
    private String benefits;
    private String requiredDocuments;
    private String applicationMethod;
    private String officialSourceUrl;
    private boolean isDemoData;
    private LocalDate lastVerifiedDate;

    public static SchemeDto from(GovernmentScheme scheme) {
        SchemeDto dto = new SchemeDto();
        dto.id = scheme.getId();
        dto.name = scheme.getName();
        dto.category = scheme.getCategory();
        dto.description = scheme.getDescription();
        dto.eligibilityCriteria = scheme.getEligibilityCriteria();
        dto.benefits = scheme.getBenefits();
        dto.requiredDocuments = scheme.getRequiredDocuments();
        dto.applicationMethod = scheme.getApplicationMethod();
        dto.officialSourceUrl = scheme.getOfficialSourceUrl();
        dto.isDemoData = scheme.isDemoData();
        dto.lastVerifiedDate = scheme.getLastVerifiedDate();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public String getBenefits() { return benefits; }
    public String getRequiredDocuments() { return requiredDocuments; }
    public String getApplicationMethod() { return applicationMethod; }
    public String getOfficialSourceUrl() { return officialSourceUrl; }
    public boolean isDemoData() { return isDemoData; }
    public LocalDate getLastVerifiedDate() { return lastVerifiedDate; }
}
