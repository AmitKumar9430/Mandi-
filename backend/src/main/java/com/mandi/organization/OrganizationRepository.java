package com.mandi.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findByCode(String code);

    List<Organization> findByActiveTrue();

    List<Organization> findByCategoryAndActiveTrue(OrganizationCategory category);

    @Query("SELECT o FROM Organization o WHERE o.active = true AND " +
           "(:category IS NULL OR o.category = :category) AND " +
           "(:district IS NULL OR LOWER(o.district) = LOWER(:district))")
    List<Organization> searchOrganizations(
            @Param("category") OrganizationCategory category,
            @Param("district") String district
    );

    @Query("SELECT o FROM Organization o WHERE o.leadUser.id = :userId AND o.active = true")
    Optional<Organization> findByLeadUserId(@Param("userId") Long userId);
}
