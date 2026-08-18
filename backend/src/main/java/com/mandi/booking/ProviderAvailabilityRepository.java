package com.mandi.booking;

import com.mandi.problem.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProviderAvailabilityRepository extends JpaRepository<ProviderAvailability, Long> {

    List<ProviderAvailability> findByProviderIdOrderByAvailableDateAsc(Long providerId);

    List<ProviderAvailability> findByServiceTypeAndAvailableDateAndIsBlockedFalse(
            ServiceType serviceType,
            LocalDate availableDate
    );

    List<ProviderAvailability> findByProviderIdAndAvailableDate(Long providerId, LocalDate date);
}
