package com.mandi.booking;

import com.mandi.booking.dto.BookingDto;
import com.mandi.booking.dto.CreateBookingRequest;
import com.mandi.booking.dto.RescheduleBookingRequest;
import com.mandi.booking.dto.ServiceRatingRequest;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.notification.NotificationService;
import com.mandi.notification.NotificationType;
import com.mandi.problem.Problem;
import com.mandi.problem.ProblemRepository;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceRepository;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final ProviderAvailabilityRepository availabilityRepository;
    private final ServiceRatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public BookingService(
            BookingRepository bookingRepository,
            ProviderAvailabilityRepository availabilityRepository,
            ServiceRatingRepository ratingRepository,
            UserRepository userRepository,
            ProblemRepository problemRepository,
            ResourceRepository resourceRepository,
            NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.availabilityRepository = availabilityRepository;
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public BookingDto createBooking(User requester, CreateBookingRequest req) {
        User provider = userRepository.findById(req.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider", req.getProviderId()));

        if (requester.getId().equals(provider.getId())) {
            throw new IllegalArgumentException("You cannot book your own service or equipment.");
        }

        if (req.getStartTime().isAfter(req.getEndTime()) || req.getStartTime().equals(req.getEndTime())) {
            throw new IllegalArgumentException("Start time must be strictly before end time.");
        }

        // Double-Booking Protection: Check existing active bookings for collision
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                provider.getId(),
                req.getBookingDate(),
                req.getStartTime(),
                req.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            Booking c = conflicts.get(0);
            throw new IllegalStateException(String.format(
                    "Double booking conflict: Provider is already booked on %s between %s and %s. Please select an alternate time slot.",
                    req.getBookingDate(), c.getStartTime(), c.getEndTime()
            ));
        }

        Booking booking = new Booking();
        booking.setRequester(requester);
        booking.setProvider(provider);

        if (req.getProblemId() != null) {
            Problem p = problemRepository.findById(req.getProblemId()).orElse(null);
            booking.setProblem(p);
        }
        if (req.getResourceId() != null) {
            Resource r = resourceRepository.findById(req.getResourceId()).orElse(null);
            booking.setResource(r);
        }

        booking.setServiceType(req.getServiceType());
        booking.setBookingDate(req.getBookingDate());
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        booking.setAgreedPrice(req.getAgreedPrice() != null ? req.getAgreedPrice() : 1000.0);
        booking.setPriceUnit(req.getPriceUnit() != null ? req.getPriceUnit() : "per hour");
        booking.setBookingStatus(BookingStatus.PENDING);

        booking.setServiceAddress(req.getServiceAddress());
        booking.setVillageOrTown(req.getVillageOrTown());
        booking.setDistrict(req.getDistrict());
        booking.setState(req.getState());
        booking.setLatitude(req.getLatitude());
        booking.setLongitude(req.getLongitude());
        booking.setContactPhone(req.getContactPhone() != null ? req.getContactPhone() : requester.getPhone());
        booking.setNotes(req.getNotes());

        Booking saved = bookingRepository.save(booking);

        // Notify Provider
        try {
            notificationService.sendNotification(
                    provider,
                    "New Service Booking Request - " + req.getServiceType().name(),
                    String.format("Citizen %s requested %s for %s (%s – %s). Location: %s, %s",
                            requester.getFullName(), req.getServiceType().name(), req.getBookingDate(),
                            req.getStartTime(), req.getEndTime(), req.getVillageOrTown(), req.getDistrict()),
                    NotificationType.BOOKING_REQUEST,
                    saved.getId(),
                    "BOOKING-" + saved.getId(),
                    "/user/bookings"
            );
        } catch (Exception e) {
            log.warn("Notification notice: {}", e.getMessage());
        }

        return BookingDto.from(saved);
    }

    @Transactional
    public BookingDto acceptBooking(User provider, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("Unauthorized: Only the assigned service provider can accept this booking.");
        }

        // Re-check collision before acceptance
        List<Booking> conflicts = bookingRepository.findOverlappingBookingsExcluding(
                provider.getId(),
                booking.getId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Double booking conflict: Another active booking overlaps with this time slot.");
        }

        booking.setBookingStatus(BookingStatus.ACCEPTED);
        Booking saved = bookingRepository.save(booking);

        // Notify Requester
        try {
            notificationService.sendNotification(
                    booking.getRequester(),
                    "Booking Accepted! - " + booking.getServiceType().name(),
                    String.format("Provider %s has ACCEPTED your %s booking for %s (%s – %s).",
                            provider.getFullName(), booking.getServiceType().name(),
                            booking.getBookingDate(), booking.getStartTime(), booking.getEndTime()),
                    NotificationType.BOOKING_ACCEPTED,
                    saved.getId(),
                    "BOOKING-" + saved.getId(),
                    "/user/bookings"
            );
        } catch (Exception e) {
            log.warn("Notification notice: {}", e.getMessage());
        }

        return BookingDto.from(saved);
    }

    @Transactional
    public BookingDto rejectBooking(User provider, Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("Unauthorized: Only the assigned provider can reject this booking.");
        }

        booking.setBookingStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason != null ? reason : "Provider unavailable at requested time.");
        Booking saved = bookingRepository.save(booking);

        // Notify Requester
        try {
            notificationService.sendNotification(
                    booking.getRequester(),
                    "Booking Update - Request Declined",
                    String.format("Provider %s was unable to accept your booking for %s. Reason: %s",
                            provider.getFullName(), booking.getBookingDate(), booking.getRejectionReason()),
                    NotificationType.BOOKING_REJECTED,
                    saved.getId(),
                    "BOOKING-" + saved.getId(),
                    "/user/bookings"
            );
        } catch (Exception e) {
            log.warn("Notification notice: {}", e.getMessage());
        }

        return BookingDto.from(saved);
    }

    @Transactional
    public BookingDto rescheduleBooking(User user, Long bookingId, RescheduleBookingRequest req) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        boolean isRequester = booking.getRequester().getId().equals(user.getId());
        boolean isProvider = booking.getProvider().getId().equals(user.getId());

        if (!isRequester && !isProvider) {
            throw new IllegalArgumentException("Unauthorized to modify this booking.");
        }

        // Collision check on new proposed time
        List<Booking> conflicts = bookingRepository.findOverlappingBookingsExcluding(
                booking.getProvider().getId(),
                booking.getId(),
                req.getSuggestedDate(),
                req.getSuggestedStartTime(),
                req.getSuggestedEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("The proposed reschedule slot collides with an existing booking. Please pick another time.");
        }

        booking.setBookingStatus(BookingStatus.RESCHEDULED);
        booking.setRescheduleSuggestedDate(req.getSuggestedDate());
        booking.setRescheduleSuggestedStartTime(req.getSuggestedStartTime());
        booking.setRescheduleSuggestedEndTime(req.getSuggestedEndTime());
        booking.setRescheduleReason(req.getReason());

        Booking saved = bookingRepository.save(booking);

        // Notify other party
        User notifyUser = isRequester ? booking.getProvider() : booking.getRequester();
        try {
            notificationService.sendNotification(
                    notifyUser,
                    "Booking Reschedule Proposed",
                    String.format("%s proposed new time for %s: %s (%s – %s). Reason: %s",
                            user.getFullName(), booking.getServiceType().name(),
                            req.getSuggestedDate(), req.getSuggestedStartTime(), req.getSuggestedEndTime(), req.getReason()),
                    NotificationType.BOOKING_RESCHEDULED,
                    saved.getId(),
                    "BOOKING-" + saved.getId(),
                    "/user/bookings"
            );
        } catch (Exception e) {
            log.warn("Notification notice: {}", e.getMessage());
        }

        return BookingDto.from(saved);
    }

    @Transactional
    public BookingDto acceptReschedule(User user, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (booking.getRescheduleSuggestedDate() == null) {
            throw new IllegalStateException("No reschedule proposal is currently pending.");
        }

        // Apply new slot
        booking.setBookingDate(booking.getRescheduleSuggestedDate());
        booking.setStartTime(booking.getRescheduleSuggestedStartTime());
        booking.setEndTime(booking.getRescheduleSuggestedEndTime());
        booking.setBookingStatus(BookingStatus.ACCEPTED);

        booking.setRescheduleSuggestedDate(null);
        booking.setRescheduleSuggestedStartTime(null);
        booking.setRescheduleSuggestedEndTime(null);

        Booking saved = bookingRepository.save(booking);
        return BookingDto.from(saved);
    }

    @Transactional
    public BookingDto markServiceDelivered(User provider, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("Unauthorized.");
        }

        booking.setProviderDelivered(true);
        booking.setBookingStatus(BookingStatus.SERVICE_DELIVERED);
        Booking saved = bookingRepository.save(booking);

        try {
            notificationService.sendNotification(
                    booking.getRequester(),
                    "Service Delivered - Confirmation Needed",
                    String.format("Provider %s marked %s as delivered. Please verify and confirm completion.",
                            provider.getFullName(), booking.getServiceType().name()),
                    NotificationType.WORK_COMPLETED,
                    saved.getId(),
                    "BOOKING-" + saved.getId(),
                    "/user/bookings"
            );
        } catch (Exception e) {
            log.warn("Notification notice: {}", e.getMessage());
        }

        return BookingDto.from(saved);
    }

    @Transactional
    public BookingDto confirmBooking(User requester, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        if (!booking.getRequester().getId().equals(requester.getId())) {
            throw new IllegalArgumentException("Unauthorized: Only the requester can confirm service completion.");
        }

        booking.setRequesterConfirmed(true);
        booking.setBookingStatus(BookingStatus.COMPLETED);
        Booking saved = bookingRepository.save(booking);

        // Update resource completed cases count if linked
        if (booking.getResource() != null) {
            Resource r = booking.getResource();
            r.setSuccessfulCasesCount((r.getSuccessfulCasesCount() != null ? r.getSuccessfulCasesCount() : 0) + 1);
            resourceRepository.save(r);
        }

        try {
            notificationService.sendNotification(
                    booking.getProvider(),
                    "Service Completed & Verified! ★",
                    String.format("Citizen %s has confirmed completion of %s. Great job!",
                            requester.getFullName(), booking.getServiceType().name()),
                    NotificationType.BOOKING_COMPLETED,
                    saved.getId(),
                    "BOOKING-" + saved.getId(),
                    "/user/bookings"
            );
        } catch (Exception e) {
            log.warn("Notification notice: {}", e.getMessage());
        }

        return BookingDto.from(saved);
    }

    @Transactional
    public void rateBooking(User author, Long bookingId, ServiceRatingRequest req) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        boolean isRequester = booking.getRequester().getId().equals(author.getId());
        boolean isProvider = booking.getProvider().getId().equals(author.getId());

        if (!isRequester && !isProvider) {
            throw new IllegalArgumentException("Unauthorized to rate this booking.");
        }

        // Prevent duplicate rating
        if (ratingRepository.findByBookingIdAndAuthorId(bookingId, author.getId()).isPresent()) {
            throw new IllegalStateException("You have already submitted a rating for this service.");
        }

        User target = isRequester ? booking.getProvider() : booking.getRequester();

        ServiceRating rating = new ServiceRating();
        rating.setBooking(booking);
        rating.setAuthor(author);
        rating.setTarget(target);
        rating.setRating(req.getRating());
        rating.setFeedback(req.getFeedback());
        rating.setTags(req.getTags());
        ratingRepository.save(rating);

        // If requester rated provider's resource, recalculate resource average rating
        if (isRequester && booking.getResource() != null) {
            Resource r = booking.getResource();
            int reviews = r.getTotalReviews() != null ? r.getTotalReviews() : 0;
            double currentRating = r.getRating() != null ? r.getRating() : 5.0;
            double newAvg = ((currentRating * reviews) + req.getRating()) / (reviews + 1);
            r.setRating(Math.round(newAvg * 10.0) / 10.0);
            r.setTotalReviews(reviews + 1);
            resourceRepository.save(r);
        }
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getMyRequesterBookings(Long requesterId) {
        return bookingRepository.findByRequesterIdOrderByBookingDateDesc(requesterId).stream()
                .map(BookingDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getMyProviderBookings(Long providerId) {
        return bookingRepository.findByProviderIdOrderByBookingDateDesc(providerId).stream()
                .map(BookingDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        return BookingDto.from(b);
    }
}
