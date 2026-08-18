package com.mandi.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRequesterIdOrderByBookingDateDesc(Long requesterId);

    List<Booking> findByProviderIdOrderByBookingDateDesc(Long providerId);

    /**
     * Finds conflicting/overlapping bookings for a provider on a specific date.
     * Prevents double-booking: Any existing booking with status ACCEPTED or IN_PROGRESS
     * that overlaps with requested [startTime, endTime].
     */
    @Query("SELECT b FROM Booking b WHERE b.provider.id = :providerId " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.bookingStatus IN ('ACCEPTED', 'IN_PROGRESS') " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findOverlappingBookings(
            @Param("providerId") Long providerId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("SELECT b FROM Booking b WHERE b.provider.id = :providerId " +
            "AND b.id <> :excludeBookingId " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.bookingStatus IN ('ACCEPTED', 'IN_PROGRESS') " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findOverlappingBookingsExcluding(
            @Param("providerId") Long providerId,
            @Param("excludeBookingId") Long excludeBookingId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
