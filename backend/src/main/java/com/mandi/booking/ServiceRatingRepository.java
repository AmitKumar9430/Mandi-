package com.mandi.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRatingRepository extends JpaRepository<ServiceRating, Long> {

    List<ServiceRating> findByTargetIdOrderByCreatedAtDesc(Long targetId);

    Optional<ServiceRating> findByBookingIdAndAuthorId(Long bookingId, Long authorId);

    List<ServiceRating> findByBookingId(Long bookingId);
}
