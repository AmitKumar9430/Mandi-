package com.mandi.booking;

import com.mandi.booking.dto.BookingDto;
import com.mandi.booking.dto.CreateBookingRequest;
import com.mandi.booking.dto.RescheduleBookingRequest;
import com.mandi.booking.dto.ServiceRatingRequest;
import com.mandi.common.ApiResponse;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.security.UserPrincipal;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    private User resolveUser(UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            throw new IllegalArgumentException("Authentication required.");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateBookingRequest request) {
        User user = resolveUser(principal);
        BookingDto booking = bookingService.createBooking(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Booking request placed successfully. Provider will respond shortly.", booking));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<BookingDto>> acceptBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        User user = resolveUser(principal);
        BookingDto booking = bookingService.acceptBooking(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Booking accepted and scheduled successfully!", booking));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<BookingDto>> rejectBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        User user = resolveUser(principal);
        String reason = body != null ? body.get("reason") : "Provider unavailable";
        BookingDto booking = bookingService.rejectBooking(user, id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Booking declined.", booking));
    }

    @PostMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<BookingDto>> rescheduleBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody RescheduleBookingRequest request) {
        User user = resolveUser(principal);
        BookingDto booking = bookingService.rescheduleBooking(user, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Reschedule proposal submitted.", booking));
    }

    @PostMapping("/{id}/reschedule/accept")
    public ResponseEntity<ApiResponse<BookingDto>> acceptReschedule(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        User user = resolveUser(principal);
        BookingDto booking = bookingService.acceptReschedule(user, id);
        return ResponseEntity.ok(ApiResponse.ok("New schedule accepted!", booking));
    }

    @PostMapping("/{id}/deliver")
    public ResponseEntity<ApiResponse<BookingDto>> markDelivered(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        User user = resolveUser(principal);
        BookingDto booking = bookingService.markServiceDelivered(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Service marked as delivered. Awaiting requester verification.", booking));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<BookingDto>> confirmBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        User user = resolveUser(principal);
        BookingDto booking = bookingService.confirmBooking(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Service confirmed completed! Thank you.", booking));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<ApiResponse<String>> rateBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ServiceRatingRequest request) {
        User user = resolveUser(principal);
        bookingService.rateBooking(user, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Rating submitted successfully.", "SUCCESS"));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyRequesterBookings(@AuthenticationPrincipal UserPrincipal principal) {
        User user = resolveUser(principal);
        List<BookingDto> bookings = bookingService.getMyRequesterBookings(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyProviderBookings(@AuthenticationPrincipal UserPrincipal principal) {
        User user = resolveUser(principal);
        List<BookingDto> bookings = bookingService.getMyProviderBookings(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(@PathVariable Long id) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }
}
