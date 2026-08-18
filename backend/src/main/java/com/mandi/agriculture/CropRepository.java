package com.mandi.agriculture;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<Crop> findByStatus(String status);

    @Query("SELECT c FROM Crop c WHERE c.status = 'AVAILABLE' AND " +
            "(:search IS NULL OR LOWER(c.cropName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.variety) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.district) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Crop> searchAvailableCrops(@Param("search") String search, Pageable pageable);
}
