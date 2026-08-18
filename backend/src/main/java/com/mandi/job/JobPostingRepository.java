package com.mandi.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByEmployerIdOrderByCreatedAtDesc(Long employerId);

    @Query("SELECT j FROM JobPosting j WHERE j.status = 'OPEN' AND " +
            "(:skillCategory IS NULL OR j.skillCategory = :skillCategory) AND " +
            "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.district) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<JobPosting> searchOpenJobs(
            @Param("skillCategory") String skillCategory,
            @Param("search") String search,
            Pageable pageable);
}
