package com.mandi.transport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface VehicleAvailabilityRepository extends JpaRepository<VehicleAvailability, Long> {

    List<VehicleAvailability> findByVehicleIdAndAvailableDateGreaterThanEqualOrderByAvailableDateAscStartTimeAsc(
            Long vehicleId, LocalDate date);

    List<VehicleAvailability> findByVehicleIdAndAvailableDate(Long vehicleId, LocalDate availableDate);

    @Query("SELECT va FROM VehicleAvailability va WHERE va.vehicle.id = :vehicleId " +
           "AND va.availableDate = :date " +
           "AND va.status IN ('BOOKED', 'BLOCKED', 'MAINTENANCE') " +
           "AND (:startTime < va.endTime AND :endTime > va.startTime)")
    List<VehicleAvailability> findConflictingSlots(@Param("vehicleId") Long vehicleId,
                                                   @Param("date") LocalDate date,
                                                   @Param("startTime") LocalTime startTime,
                                                   @Param("endTime") LocalTime endTime);
}
