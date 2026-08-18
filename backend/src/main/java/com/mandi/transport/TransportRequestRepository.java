package com.mandi.transport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRequestRepository extends JpaRepository<TransportRequest, Long> {

    List<TransportRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<TransportRequest> findByAssignedProviderIdOrderByCreatedAtDesc(Long providerId);

    List<TransportRequest> findByPickupDistrictIgnoreCaseAndStatus(String pickupDistrict, String status);

    List<TransportRequest> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT tr FROM TransportRequest tr WHERE tr.status IN ('REQUESTED', 'MATCHED') " +
           "AND LOWER(tr.pickupDistrict) = LOWER(:district)")
    List<TransportRequest> findActiveRequestsNearDistrict(@Param("district") String district);
}
