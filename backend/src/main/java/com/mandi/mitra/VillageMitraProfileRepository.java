package com.mandi.mitra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VillageMitraProfileRepository extends JpaRepository<VillageMitraProfile, Long> {

    Optional<VillageMitraProfile> findByUserId(Long userId);

    List<VillageMitraProfile> findByActiveTrue();

    List<VillageMitraProfile> findByAssignedDistrictIgnoreCaseAndActiveTrue(String assignedDistrict);

    List<VillageMitraProfile> findByAssignedBlockIgnoreCaseAndActiveTrue(String assignedBlock);

    @Query("SELECT m FROM VillageMitraProfile m WHERE m.active = true AND " +
           "(LOWER(m.assignedDistrict) = LOWER(:district) OR LOWER(m.assignedBlock) = LOWER(:block))")
    List<VillageMitraProfile> findMitrasNear(@Param("district") String district,
                                             @Param("block") String block);
}
