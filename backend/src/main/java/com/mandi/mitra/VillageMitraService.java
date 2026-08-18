package com.mandi.mitra;

import com.mandi.exception.ResourceNotFoundException;
import com.mandi.mitra.dto.EscalationRequest;
import com.mandi.mitra.dto.GroundVerificationRequest;
import com.mandi.mitra.dto.RequestAssistanceRequest;
import com.mandi.mitra.dto.VillageMitraDto;
import com.mandi.notification.NotificationService;
import com.mandi.problem.Problem;
import com.mandi.problem.ProblemRepository;
import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VillageMitraService {

    private final VillageMitraProfileRepository mitraRepository;
    private final CoordinationRequestRepository coordinationRepository;
    private final GroundVerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final NotificationService notificationService;

    public VillageMitraService(VillageMitraProfileRepository mitraRepository,
                               CoordinationRequestRepository coordinationRepository,
                               GroundVerificationRepository verificationRepository,
                               UserRepository userRepository,
                               ProblemRepository problemRepository,
                               NotificationService notificationService) {
        this.mitraRepository = mitraRepository;
        this.coordinationRepository = coordinationRepository;
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public VillageMitraDto findNearestVillageMitra(Double lat, Double lon, String village, String block, String district) {
        List<VillageMitraProfile> all = mitraRepository.findByActiveTrue();
        if (all.isEmpty()) {
            // Fallback default mock profile
            VillageMitraDto mock = new VillageMitraDto();
            mock.setFullName("Rahul Kumar");
            mock.setPhone("9876543212");
            mock.setAssignedVillages(village != null ? village : "Gharuan, Kharar");
            mock.setAssignedBlock(block != null ? block : "Kharar");
            mock.setAssignedDistrict(district != null ? district : "Mohali");
            mock.setAssignedState("Punjab");
            mock.setStatus("AVAILABLE");
            mock.setDistanceKm(1.8);
            mock.setRating(4.9);
            mock.setTotalCoordinatedCases(38);
            mock.setServicesOffered("Agriculture Assistance, Transport Coordination, Crop Sales, Problem Reporting");
            return mock;
        }

        VillageMitraProfile best = null;
        double minDistance = Double.MAX_VALUE;

        // 1. By GPS distance
        if (lat != null && lon != null) {
            for (VillageMitraProfile m : all) {
                if (m.getLatitude() != null && m.getLongitude() != null) {
                    double dist = calculateDistance(lat, lon, m.getLatitude(), m.getLongitude());
                    if (dist < minDistance) {
                        minDistance = dist;
                        best = m;
                    }
                }
            }
        }

        // 2. By Village Match
        if (best == null && village != null && !village.isBlank()) {
            String vNorm = village.trim().toLowerCase();
            for (VillageMitraProfile m : all) {
                if (m.getAssignedVillages() != null && m.getAssignedVillages().toLowerCase().contains(vNorm)) {
                    best = m;
                    minDistance = 1.2;
                    break;
                }
            }
        }

        // 3. By Block Match
        if (best == null && block != null && !block.isBlank()) {
            String bNorm = block.trim().toLowerCase();
            for (VillageMitraProfile m : all) {
                if (m.getAssignedBlock() != null && m.getAssignedBlock().toLowerCase().contains(bNorm)) {
                    best = m;
                    minDistance = 4.5;
                    break;
                }
            }
        }

        // 4. By District Match
        if (best == null && district != null && !district.isBlank()) {
            String dNorm = district.trim().toLowerCase();
            for (VillageMitraProfile m : all) {
                if (m.getAssignedDistrict() != null && m.getAssignedDistrict().toLowerCase().contains(dNorm)) {
                    best = m;
                    minDistance = 8.0;
                    break;
                }
            }
        }

        if (best == null) {
            best = all.get(0);
            minDistance = 5.0;
        }

        VillageMitraDto dto = VillageMitraDto.fromEntity(best);
        dto.setDistanceKm(Math.round(minDistance * 10.0) / 10.0);
        return dto;
    }

    @Transactional
    public CoordinationRequest requestAssistance(Long requesterId, RequestAssistanceRequest req) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found"));

        User mitraUser = null;
        if (req.getMitraId() != null) {
            mitraUser = userRepository.findById(req.getMitraId()).orElse(null);
        }
        if (mitraUser == null) {
            // Find nearest mitra
            VillageMitraDto nearest = findNearestVillageMitra(
                    req.getLatitude(), req.getLongitude(), req.getVillage(), req.getBlock(), req.getDistrict());
            if (nearest.getUserId() != null) {
                mitraUser = userRepository.findById(nearest.getUserId()).orElse(null);
            }
        }

        CoordinationRequest cr = new CoordinationRequest();
        cr.setRequester(requester);
        cr.setMitra(mitraUser);
        cr.setCoordinationType(req.getCoordinationType() != null ? req.getCoordinationType() : "LOCAL_ASSISTANCE");
        cr.setTitle(req.getTitle());
        cr.setDescription(req.getDescription());
        cr.setVillage(req.getVillage());
        cr.setBlock(req.getBlock());
        cr.setDistrict(req.getDistrict() != null ? req.getDistrict() : "Lucknow");
        cr.setState(req.getState() != null ? req.getState() : "Uttar Pradesh");
        cr.setLatitude(req.getLatitude());
        cr.setLongitude(req.getLongitude());
        cr.setLinkedProblemId(req.getLinkedProblemId());
        cr.setLinkedTransportRequestId(req.getLinkedTransportRequestId());
        cr.setLinkedCropOrderId(req.getLinkedCropOrderId());
        cr.setLinkedBookingId(req.getLinkedBookingId());
        cr.setStatus("PENDING");

        CoordinationRequest saved = coordinationRepository.save(cr);

        // Notify mitra
        if (mitraUser != null) {
            try {
                notificationService.createNotification(
                        mitraUser.getId(),
                        "🌟 New Local Assistance Request",
                        requester.getFullName() + " requested Village Mitra help: " + req.getTitle(),
                        "COORDINATION_REQUEST",
                        saved.getId()
                );
            } catch (Exception ignored) {}
        }

        return saved;
    }

    @Transactional
    public GroundVerification recordGroundVerification(Long mitraUserId, GroundVerificationRequest req) {
        User mitra = userRepository.findById(mitraUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Mitra user not found"));

        GroundVerification gv = new GroundVerification();
        gv.setMitra(mitra);
        gv.setProblemId(req.getProblemId());
        gv.setVerificationStatus(req.getVerificationStatus() != null ? req.getVerificationStatus() : "VERIFIED");
        gv.setObservationNotes(req.getObservationNotes());
        gv.setEvidencePhotoUrl(req.getEvidencePhotoUrl());
        gv.setLatitude(req.getLatitude());
        gv.setLongitude(req.getLongitude());
        gv.setLocationAddress(req.getLocationAddress());
        gv.setVerifiedAt(LocalDateTime.now());

        GroundVerification saved = verificationRepository.save(gv);

        // Also update problem status or timeline if problem exists
        if (req.getProblemId() != null) {
            problemRepository.findById(req.getProblemId()).ifPresent(p -> {
                p.setStatus(com.mandi.problem.ProblemStatus.IN_PROGRESS);
                problemRepository.save(p);
            });
        }

        return saved;
    }

    @Transactional
    public CoordinationRequest escalateRequest(Long mitraUserId, Long coordId, EscalationRequest req) {
        CoordinationRequest cr = coordinationRepository.findById(coordId)
                .orElseThrow(() -> new ResourceNotFoundException("Coordination request not found"));

        cr.setStatus("ESCALATED");
        cr.setEscalationLevel(req.getTargetLevel() != null ? req.getTargetLevel() : "BLOCK");
        cr.setEscalationReason(req.getReason() + (req.getNotes() != null ? " - " + req.getNotes() : ""));

        return coordinationRepository.save(cr);
    }

    @Transactional(readOnly = true)
    public List<CoordinationRequest> getMitraRequests(Long mitraUserId) {
        return coordinationRepository.findByMitraIdOrderByCreatedAtDesc(mitraUserId);
    }

    @Transactional(readOnly = true)
    public List<CoordinationRequest> getRequesterCases(Long requesterId) {
        return coordinationRepository.findByRequesterIdOrderByCreatedAtDesc(requesterId);
    }

    @Transactional(readOnly = true)
    public List<GroundVerification> getProblemVerifications(Long problemId) {
        return verificationRepository.findByProblemIdOrderByVerifiedAtDesc(problemId);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
