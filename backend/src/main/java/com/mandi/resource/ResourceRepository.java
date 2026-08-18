package com.mandi.resource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByOwnerId(Long ownerId);

    Page<Resource> findByCategoryAndAvailableTrue(ResourceCategory category, Pageable pageable);

    List<Resource> findByCategoryAndAvailableTrue(ResourceCategory category);

    @Query("SELECT r FROM Resource r WHERE r.available = true AND " +
            "(:category IS NULL OR r.category = :category) AND " +
            "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.villageOrTown) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Resource> searchAvailableResources(
            @Param("category") ResourceCategory category,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT r FROM Resource r WHERE r.available = true AND r.latitude IS NOT NULL AND r.longitude IS NOT NULL")
    List<Resource> findAvailableForMap();

    long countByCategory(ResourceCategory category);
}
