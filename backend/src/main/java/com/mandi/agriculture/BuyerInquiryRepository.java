package com.mandi.agriculture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuyerInquiryRepository extends JpaRepository<BuyerInquiry, Long> {
    List<BuyerInquiry> findByCropIdOrderByCreatedAtDesc(Long cropId);
    List<BuyerInquiry> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
}
