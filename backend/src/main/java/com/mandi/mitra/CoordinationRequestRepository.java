package com.mandi.mitra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoordinationRequestRepository extends JpaRepository<CoordinationRequest, Long> {

    List<CoordinationRequest> findByMitraIdOrderByCreatedAtDesc(Long mitraId);

    List<CoordinationRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<CoordinationRequest> findByDistrictIgnoreCaseAndStatus(String district, String status);

    List<CoordinationRequest> findByStatusOrderByCreatedAtDesc(String status);
}
