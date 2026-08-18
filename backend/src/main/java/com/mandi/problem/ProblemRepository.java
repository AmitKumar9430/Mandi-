package com.mandi.problem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Page<Problem> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Problem> findByAssignedOrganizationIdOrderByCreatedAtDesc(Long orgId, Pageable pageable);

    Page<Problem> findByAssignedResolverIdOrderByCreatedAtDesc(Long resolverId, Pageable pageable);

    Page<Problem> findByStatus(ProblemStatus status, Pageable pageable);

    Page<Problem> findByCategory(ProblemCategory category, Pageable pageable);

    @Query("SELECT p FROM Problem p WHERE " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:urgency IS NULL OR p.urgency = :urgency) AND " +
            "(:district IS NULL OR LOWER(p.district) = LOWER(:district)) AND " +
            "(:orgId IS NULL OR p.assignedOrganization.id = :orgId) AND " +
            "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.rawDescription) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.locationName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.villageOrTown) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Problem> searchProblemsAdvanced(
            @Param("category") ProblemCategory category,
            @Param("status") ProblemStatus status,
            @Param("urgency") ProblemUrgency urgency,
            @Param("district") String district,
            @Param("orgId") Long orgId,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT p FROM Problem p WHERE " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:urgency IS NULL OR p.urgency = :urgency) AND " +
            "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.rawDescription) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.locationName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Problem> searchProblems(
            @Param("category") ProblemCategory category,
            @Param("status") ProblemStatus status,
            @Param("urgency") ProblemUrgency urgency,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT p FROM Problem p WHERE p.category = :category AND " +
            "(:district IS NULL OR LOWER(p.district) = LOWER(:district)) AND " +
            "p.status NOT IN ('CLOSED', 'REJECTED') ORDER BY p.createdAt DESC")
    List<Problem> findPotentialDuplicates(
            @Param("category") ProblemCategory category,
            @Param("district") String district,
            Pageable pageable
    );

    @Query("SELECT p FROM Problem p WHERE p.slaDeadline IS NOT NULL AND p.slaDeadline < :now AND p.status NOT IN ('RESOLVED', 'VERIFICATION_PENDING', 'COMPLETED', 'CLOSED', 'REJECTED')")
    List<Problem> findOverdueActiveProblems(@Param("now") Instant now);

    @Query("SELECT p FROM Problem p WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL AND p.status NOT IN ('CLOSED', 'REJECTED')")
    List<Problem> findActiveProblemsForMap();

    List<Problem> findByDistrictIgnoreCase(String district);

    long countByStatus(ProblemStatus status);
    long countByCategory(ProblemCategory category);
    long countByIsOverdueTrue();
    long countByIsEscalatedTrue();
}
