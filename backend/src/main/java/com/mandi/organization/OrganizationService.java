package com.mandi.organization;

import com.mandi.exception.ResourceNotFoundException;
import com.mandi.problem.ProblemCategory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public List<Organization> getAllActiveOrganizations() {
        return organizationRepository.findByActiveTrue();
    }

    public List<Organization> searchOrganizations(OrganizationCategory category, String district) {
        return organizationRepository.searchOrganizations(category, district);
    }

    public Organization getById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", id));
    }

    public Organization findBestMatchingOrganization(ProblemCategory category, String district) {
        OrganizationCategory orgCategory = mapProblemCategoryToOrgCategory(category);

        // 1. Try exact district and category match
        List<Organization> matches = organizationRepository.searchOrganizations(orgCategory, district);
        if (!matches.isEmpty()) {
            return matches.get(0);
        }

        // 2. Try state/general category match
        List<Organization> categoryMatches = organizationRepository.findByCategoryAndActiveTrue(orgCategory);
        if (!categoryMatches.isEmpty()) {
            return categoryMatches.get(0);
        }

        // 3. Fallback to any general NGO/Civic org
        return organizationRepository.findByActiveTrue().stream().findFirst().orElse(null);
    }

    public OrganizationCategory mapProblemCategoryToOrgCategory(ProblemCategory category) {
        if (category == null) return OrganizationCategory.OTHER;
        return switch (category) {
            case AGRICULTURE -> OrganizationCategory.AGRICULTURE;
            case HEALTHCARE -> OrganizationCategory.HEALTHCARE;
            case ELECTRICITY -> OrganizationCategory.ELECTRICITY;
            case WATER_SANITATION -> OrganizationCategory.WATER_SANITATION;
            case INFRASTRUCTURE -> OrganizationCategory.ROADS_INFRASTRUCTURE;
            case EDUCATION -> OrganizationCategory.EDUCATION;
            case EMERGENCY -> OrganizationCategory.EMERGENCY_RELIEF;
            case SOCIAL_WELFARE, LEGAL_AID -> OrganizationCategory.SOCIAL_WELFARE;
            case EMPLOYMENT, OTHER -> OrganizationCategory.NGO_WELFARE;
        };
    }

    @Transactional
    public void recordAssignment(Long orgId) {
        if (orgId == null) return;
        organizationRepository.findById(orgId).ifPresent(org -> {
            org.setTotalAssigned(org.getTotalAssigned() + 1);
            organizationRepository.save(org);
        });
    }

    @Transactional
    public void recordResolution(Long orgId, double resolutionHours, Integer rating) {
        if (orgId == null) return;
        organizationRepository.findById(orgId).ifPresent(org -> {
            int prevResolved = org.getTotalResolved();
            int newResolved = prevResolved + 1;
            org.setTotalResolved(newResolved);

            // Update running average resolution time
            double currentAvgHours = org.getAvgResolutionHours();
            double updatedAvgHours = ((currentAvgHours * prevResolved) + resolutionHours) / newResolved;
            org.setAvgResolutionHours(Math.round(updatedAvgHours * 10.0) / 10.0);

            // Update rating if provided
            if (rating != null && rating > 0) {
                int totalRatings = org.getTotalRatings();
                double currentAvgRating = org.getAvgRating();
                double updatedAvgRating = ((currentAvgRating * totalRatings) + rating) / (totalRatings + 1);
                org.setAvgRating(Math.round(updatedAvgRating * 10.0) / 10.0);
                org.setTotalRatings(totalRatings + 1);
            }

            organizationRepository.save(org);
        });
    }

    @Transactional
    public void recordReopen(Long orgId) {
        if (orgId == null) return;
        organizationRepository.findById(orgId).ifPresent(org -> {
            org.setReopenCount(org.getReopenCount() + 1);
            organizationRepository.save(org);
        });
    }

    @Transactional
    public void recordOverdue(Long orgId) {
        if (orgId == null) return;
        organizationRepository.findById(orgId).ifPresent(org -> {
            org.setTotalOverdue(org.getTotalOverdue() + 1);
            organizationRepository.save(org);
        });
    }

    @Transactional
    public Organization saveOrganization(Organization org) {
        return organizationRepository.save(org);
    }
}
