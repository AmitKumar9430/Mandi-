package com.mandi.transport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByProviderIdAndActiveTrue(Long providerId);

    List<Vehicle> findByActiveTrue();

    List<Vehicle> findByServiceDistrictIgnoreCaseAndActiveTrue(String serviceDistrict);

    List<Vehicle> findByVehicleTypeAndActiveTrue(VehicleType vehicleType);

    @Query("SELECT v FROM Vehicle v WHERE v.active = true AND " +
           "(:vehicleType IS NULL OR v.vehicleType = :vehicleType) AND " +
           "(:district IS NULL OR LOWER(v.serviceDistrict) = LOWER(:district))")
    List<Vehicle> searchVehicles(@Param("vehicleType") VehicleType vehicleType,
                                 @Param("district") String district);
}
