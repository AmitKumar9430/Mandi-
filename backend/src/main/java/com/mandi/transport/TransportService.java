package com.mandi.transport;

import com.mandi.exception.ResourceNotFoundException;
import com.mandi.notification.NotificationService;
import com.mandi.transport.dto.*;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransportService {

    private final VehicleRepository vehicleRepository;
    private final VehicleAvailabilityRepository availabilityRepository;
    private final TransportRequestRepository transportRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TransportService(VehicleRepository vehicleRepository,
                            VehicleAvailabilityRepository availabilityRepository,
                            TransportRequestRepository transportRequestRepository,
                            UserRepository userRepository,
                            NotificationService notificationService) {
        this.vehicleRepository = vehicleRepository;
        this.availabilityRepository = availabilityRepository;
        this.transportRequestRepository = transportRequestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public VehicleDto registerVehicle(Long providerId, CreateVehicleRequest req) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider user not found"));

        Vehicle v = new Vehicle();
        v.setProvider(provider);
        v.setVehicleType(req.getVehicleType() != null ? req.getVehicleType() : VehicleType.PICKUP);
        v.setRegistrationNumber(req.getRegistrationNumber());
        v.setModelName(req.getModelName());
        v.setCapacityTons(req.getCapacityTons() != null ? req.getCapacityTons() : 2.5);
        v.setCapacityQuintals(req.getCapacityQuintals() != null ? req.getCapacityQuintals() : 25.0);
        v.setDriverAvailable(req.isDriverAvailable());
        v.setOwnerDriver(req.isOwnerDriver());
        v.setBasePrice(req.getBasePrice() != null ? req.getBasePrice() : 500.0);
        v.setPricePerKm(req.getPricePerKm() != null ? req.getPricePerKm() : 25.0);
        v.setPricePerHour(req.getPricePerHour() != null ? req.getPricePerHour() : 400.0);
        v.setPricePerTrip(req.getPricePerTrip() != null ? req.getPricePerTrip() : 1500.0);
        v.setPricePerDay(req.getPricePerDay() != null ? req.getPricePerDay() : 3500.0);
        v.setLoadingCharge(req.getLoadingCharge() != null ? req.getLoadingCharge() : 200.0);
        v.setUnloadingCharge(req.getUnloadingCharge() != null ? req.getUnloadingCharge() : 200.0);
        v.setMaxTravelRadiusKm(req.getMaxTravelRadiusKm() != null ? req.getMaxTravelRadiusKm() : 40);
        v.setServiceVillage(req.getServiceVillage());
        v.setServiceBlock(req.getServiceBlock());
        v.setServiceDistrict(req.getServiceDistrict() != null ? req.getServiceDistrict() : "Lucknow");
        v.setServiceState(req.getServiceState() != null ? req.getServiceState() : "Uttar Pradesh");
        v.setLatitude(req.getLatitude());
        v.setLongitude(req.getLongitude());
        v.setPhotoUrl(req.getPhotoUrl());

        return VehicleDto.fromEntity(vehicleRepository.save(v));
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getProviderVehicles(Long providerId) {
        return vehicleRepository.findByProviderIdAndActiveTrue(providerId)
                .stream().map(VehicleDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public VehicleAvailability setAvailability(Long providerId, Long vehicleId, VehicleAvailabilityRequest req) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (!vehicle.getProvider().getId().equals(providerId)) {
            throw new IllegalStateException("Unauthorized: You do not own this vehicle.");
        }

        LocalTime start = req.getStartTime() != null ? req.getStartTime() : LocalTime.of(8, 0);
        LocalTime end = req.getEndTime() != null ? req.getEndTime() : LocalTime.of(18, 0);

        // Check conflicts if marking as available/booked
        VehicleAvailability va = new VehicleAvailability();
        va.setVehicle(vehicle);
        va.setAvailableDate(req.getAvailableDate());
        va.setStartTime(start);
        va.setEndTime(end);
        va.setStatus(req.getStatus() != null ? req.getStatus() : "AVAILABLE");
        va.setOverridePrice(req.getOverridePrice());
        va.setPriceUnit(req.getPriceUnit());
        va.setNotes(req.getNotes());

        return availabilityRepository.save(va);
    }

    @Transactional
    public TransportRequestDto createTransportRequest(Long requesterId, CreateTransportRequest req) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found"));

        TransportRequest tr = new TransportRequest();
        tr.setRequester(requester);
        tr.setCargoType(req.getCargoType() != null ? req.getCargoType() : "Agri Produce");
        tr.setCargoDescription(req.getCargoDescription());
        tr.setQuantityQuintals(req.getQuantityQuintals());
        tr.setWeightTons(req.getWeightTons());
        tr.setPickupVillage(req.getPickupVillage());
        tr.setPickupBlock(req.getPickupBlock());
        tr.setPickupDistrict(req.getPickupDistrict() != null ? req.getPickupDistrict() : "Lucknow");
        tr.setPickupState(req.getPickupState() != null ? req.getPickupState() : "Uttar Pradesh");
        tr.setPickupLatitude(req.getPickupLatitude());
        tr.setPickupLongitude(req.getPickupLongitude());
        tr.setDestinationVillage(req.getDestinationVillage());
        tr.setDestinationBlock(req.getDestinationBlock());
        tr.setDestinationDistrict(req.getDestinationDistrict() != null ? req.getDestinationDistrict() : "Lucknow");
        tr.setDestinationState(req.getDestinationState() != null ? req.getDestinationState() : "Uttar Pradesh");
        tr.setDestinationLatitude(req.getDestinationLatitude());
        tr.setDestinationLongitude(req.getDestinationLongitude());
        tr.setRequiredDate(req.getRequiredDate());
        tr.setStartTime(req.getStartTime() != null ? req.getStartTime() : LocalTime.of(9, 0));
        tr.setEndTime(req.getEndTime() != null ? req.getEndTime() : LocalTime.of(14, 0));
        tr.setPreferredVehicleType(req.getPreferredVehicleType());
        tr.setRequiredCapacityTons(req.getRequiredCapacityTons());
        tr.setDriverRequired(req.isDriverRequired());
        tr.setLoadingRequired(req.isLoadingRequired());
        tr.setUnloadingRequired(req.isUnloadingRequired());
        tr.setBudgetAmount(req.getBudgetAmount());
        tr.setAgreedPrice(req.getBudgetAmount());
        tr.setSpecialInstructions(req.getSpecialInstructions());
        tr.setContactPhone(req.getContactPhone() != null ? req.getContactPhone() : requester.getPhone());
        tr.setLinkedCropOrderId(req.getLinkedCropOrderId());
        tr.setStatus("REQUESTED");

        TransportRequest saved = transportRequestRepository.save(tr);

        // Notify nearby providers in same district
        try {
            List<Vehicle> nearbyVehicles = vehicleRepository.findByServiceDistrictIgnoreCaseAndActiveTrue(tr.getPickupDistrict());
            for (Vehicle v : nearbyVehicles) {
                if (!v.getProvider().getId().equals(requesterId)) {
                    notificationService.createNotification(
                            v.getProvider().getId(),
                            "🚚 New Transport Request Near You",
                            "New trip needed: " + tr.getPickupVillage() + " → " + tr.getDestinationVillage() +
                                    " (" + tr.getCargoType() + ", Date: " + tr.getRequiredDate() + ", Budget: ₹" + tr.getBudgetAmount() + ")",
                            "TRANSPORT_REQUEST",
                            saved.getId()
                    );
                }
            }
        } catch (Exception ignored) {}

        return TransportRequestDto.fromEntity(saved);
    }

    @Transactional
    public TransportRequestDto acceptTransportRequest(Long providerId, Long vehicleId, Long requestId) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (!vehicle.getProvider().getId().equals(providerId)) {
            throw new IllegalStateException("Unauthorized: You do not own this vehicle.");
        }

        TransportRequest req = transportRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transport request not found"));

        LocalTime start = req.getStartTime() != null ? req.getStartTime() : LocalTime.of(9, 0);
        LocalTime end = req.getEndTime() != null ? req.getEndTime() : LocalTime.of(14, 0);

        // Strict Double-Booking Collision Prevention at vehicle level!
        List<VehicleAvailability> conflicts = availabilityRepository.findConflictingSlots(
                vehicle.getId(), req.getRequiredDate(), start, end);
        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Double booking conflict: Vehicle (" + vehicle.getModelName() +
                    ") is already booked on " + req.getRequiredDate() + " between " + start + " and " + end +
                    ". Please select an alternate vehicle or time slot.");
        }

        // Record booked slot
        VehicleAvailability bookedSlot = new VehicleAvailability();
        bookedSlot.setVehicle(vehicle);
        bookedSlot.setAvailableDate(req.getRequiredDate());
        bookedSlot.setStartTime(start);
        bookedSlot.setEndTime(end);
        bookedSlot.setStatus("BOOKED");
        bookedSlot.setLinkedBookingId(req.getId());
        bookedSlot.setNotes("Booked for Transport Request #" + req.getId());
        availabilityRepository.save(bookedSlot);

        req.setAssignedProvider(provider);
        req.setAssignedVehicle(vehicle);
        req.setStatus("PROVIDER_ACCEPTED");
        TransportRequest saved = transportRequestRepository.save(req);

        // Notify requester
        try {
            notificationService.createNotification(
                    req.getRequester().getId(),
                    "🚚 Transport Provider Accepted Your Request!",
                    provider.getFullName() + " accepted your trip with vehicle " + vehicle.getModelName() +
                            " (" + vehicle.getRegistrationNumber() + ") on " + req.getRequiredDate(),
                    "TRANSPORT_REQUEST",
                    saved.getId()
            );
        } catch (Exception ignored) {}

        return TransportRequestDto.fromEntity(saved);
    }

    @Transactional
    public TransportRequestDto counterOffer(Long providerId, Long requestId, TransportCounterOfferRequest counter) {
        TransportRequest req = transportRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transport request not found"));

        req.setCounterPrice(counter.getCounterPrice());
        req.setCounterNotes(counter.getNotes());
        if (counter.getCounterDate() != null) req.setRequiredDate(counter.getCounterDate());
        if (counter.getCounterStartTime() != null) req.setStartTime(counter.getCounterStartTime());
        if (counter.getCounterEndTime() != null) req.setEndTime(counter.getCounterEndTime());

        req.setStatus("COUNTER_OFFERED");
        TransportRequest saved = transportRequestRepository.save(req);

        try {
            notificationService.createNotification(
                    req.getRequester().getId(),
                    "💬 Transport Provider Counter Offer",
                    "Provider countered with rate ₹" + counter.getCounterPrice() + ": " + counter.getNotes(),
                    "TRANSPORT_REQUEST",
                    saved.getId()
            );
        } catch (Exception ignored) {}

        return TransportRequestDto.fromEntity(saved);
    }

    @Transactional
    public TransportRequestDto confirmCounterOffer(Long requesterId, Long requestId) {
        TransportRequest req = transportRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transport request not found"));
        if (!req.getRequester().getId().equals(requesterId)) {
            throw new IllegalStateException("Unauthorized.");
        }
        if (req.getCounterPrice() != null) {
            req.setAgreedPrice(req.getCounterPrice());
        }
        req.setStatus("CONFIRMED");
        return TransportRequestDto.fromEntity(transportRequestRepository.save(req));
    }

    @Transactional
    public TransportRequestDto completeTrip(Long providerId, Long requestId) {
        TransportRequest req = transportRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Transport request not found"));
        req.setStatus("COMPLETED");

        if (req.getAssignedVehicle() != null) {
            Vehicle v = req.getAssignedVehicle();
            v.setTotalCompletedTrips((v.getTotalCompletedTrips() != null ? v.getTotalCompletedTrips() : 0) + 1);
            vehicleRepository.save(v);
        }

        return TransportRequestDto.fromEntity(transportRequestRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<TransportRequestDto> getMyRequests(Long requesterId) {
        return transportRequestRepository.findByRequesterIdOrderByCreatedAtDesc(requesterId)
                .stream().map(TransportRequestDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransportRequestDto> getMyProviderJobs(Long providerId) {
        return transportRequestRepository.findByAssignedProviderIdOrderByCreatedAtDesc(providerId)
                .stream().map(TransportRequestDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransportRequestDto> getNearbyRequests(String district) {
        return transportRequestRepository.findActiveRequestsNearDistrict(district)
                .stream().map(TransportRequestDto::fromEntity).collect(Collectors.toList());
    }
}
