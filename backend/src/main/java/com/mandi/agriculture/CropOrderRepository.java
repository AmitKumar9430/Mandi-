package com.mandi.agriculture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropOrderRepository extends JpaRepository<CropOrder, Long> {

    List<CropOrder> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    List<CropOrder> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<CropOrder> findByCropIdOrderByCreatedAtDesc(Long cropId);

    List<CropOrder> findByOrderStatusOrderByCreatedAtDesc(CropOrderStatus orderStatus);
}
