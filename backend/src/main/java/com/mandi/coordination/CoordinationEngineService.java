package com.mandi.coordination;

import com.mandi.agriculture.*;
import com.mandi.agriculture.dto.CropOrderCounterRequest;
import com.mandi.agriculture.dto.CropOrderDto;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.mitra.CoordinationRequest;
import com.mandi.mitra.CoordinationRequestRepository;
import com.mandi.mitra.VillageMitraService;
import com.mandi.mitra.dto.RequestAssistanceRequest;
import com.mandi.mitra.dto.VillageMitraDto;
import com.mandi.notification.NotificationService;
import com.mandi.problem.Problem;
import com.mandi.problem.ProblemRepository;
import com.mandi.problem.ProblemStatus;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceRepository;
import com.mandi.transport.*;
import com.mandi.transport.dto.CreateTransportRequest;
import com.mandi.transport.dto.TransportCounterOfferRequest;
import com.mandi.transport.dto.TransportRequestDto;
import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CoordinationEngineService {

    private static final Logger log = LoggerFactory.getLogger(CoordinationEngineService.class);

    private final CropRepository cropRepository;
    private final CropOrderRepository cropOrderRepository;
    private final CropOrderService cropOrderService;
    private final TransportRequestRepository transportRequestRepository;
    private final TransportService transportService;
    private final VehicleRepository vehicleRepository;
    private final ResourceRepository resourceRepository;
    private final ProblemRepository problemRepository;
    private final CoordinationRequestRepository coordinationRepository;
    private final VillageMitraService villageMitraService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public CoordinationEngineService(
            CropRepository cropRepository,
            CropOrderRepository cropOrderRepository,
            CropOrderService cropOrderService,
            TransportRequestRepository transportRequestRepository,
            TransportService transportService,
            VehicleRepository vehicleRepository,
            ResourceRepository resourceRepository,
            ProblemRepository problemRepository,
            CoordinationRequestRepository coordinationRepository,
            VillageMitraService villageMitraService,
            NotificationService notificationService,
            UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.cropOrderRepository = cropOrderRepository;
        this.cropOrderService = cropOrderService;
        this.transportRequestRepository = transportRequestRepository;
        this.transportService = transportService;
        this.vehicleRepository = vehicleRepository;
        this.resourceRepository = resourceRepository;
        this.problemRepository = problemRepository;
        this.coordinationRepository = coordinationRepository;
        this.villageMitraService = villageMitraService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public static class OpportunityCard {
        private String id;
        private String type;
        private String title;
        private String description;
        private String requesterOrProviderName;
        private String roleBadge;
        private String location;
        private double distanceKm;
        private double matchScore;
        private List<String> matchReasons;
        private Double price;
        private String priceUnit;
        private String actionType;
        private Long entityId;
        private String entityType;
        private Map<String, Object> metadata = new HashMap<>();

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getRequesterOrProviderName() { return requesterOrProviderName; }
        public void setRequesterOrProviderName(String requesterOrProviderName) { this.requesterOrProviderName = requesterOrProviderName; }
        public String getRoleBadge() { return roleBadge; }
        public void setRoleBadge(String roleBadge) { this.roleBadge = roleBadge; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
        public double getMatchScore() { return matchScore; }
        public void setMatchScore(double matchScore) { this.matchScore = matchScore; }
        public List<String> getMatchReasons() { return matchReasons; }
        public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public String getPriceUnit() { return priceUnit; }
        public void setPriceUnit(String priceUnit) { this.priceUnit = priceUnit; }
        public String getActionType() { return actionType; }
        public void setActionType(String actionType) { this.actionType = actionType; }
        public Long getEntityId() { return entityId; }
        public void setEntityId(Long entityId) { this.entityId = entityId; }
        public String getEntityType() { return entityType; }
        public void setEntityType(String entityType) { this.entityType = entityType; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }

    /**
     * Smart Personalized Opportunity Feed based on Authenticated User's Role and Proximity.
     */
    @Transactional(readOnly = true)
    public List<OpportunityCard> getOpportunitiesForUser(User user, int limit) {
        if (user == null) return Collections.emptyList();
        List<OpportunityCard> cards = new ArrayList<>();
        String userDist = (user.getProfile() != null && user.getProfile().getDistrict() != null)
                ? user.getProfile().getDistrict().trim() : "Mohali";
        String userVillage = (user.getProfile() != null && user.getProfile().getVillageOrTown() != null)
                ? user.getProfile().getVillageOrTown().trim() : "Gharuan";

        boolean isFarmer = user.getRoles() != null && user.getRoles().contains(Role.ROLE_FARMER);
        boolean isCitizen = user.getRoles() != null && user.getRoles().contains(Role.ROLE_CITIZEN);
        boolean isProvider = user.getRoles() != null && user.getRoles().contains(Role.ROLE_SERVICE_PROVIDER);
        boolean isMitra = user.getRoles() != null && (user.getRoles().contains(Role.ROLE_MANDI_MITRA) || user.getRoles().contains(Role.ROLE_ADMIN));

        // 1. FOR CITIZENS: Show available crops nearby, available transporters, and public announcements
        if (isCitizen || (!isFarmer && !isProvider && !isMitra)) {
            List<Crop> availableCrops = cropRepository.findByStatus("AVAILABLE");
            for (Crop c : availableCrops) {
                if (c.getFarmer() != null && !c.getFarmer().getId().equals(user.getId())) {
                    OpportunityCard op = new OpportunityCard();
                    op.setId("crop-" + c.getId());
                    op.setType("CROP_AVAILABLE");
                    op.setTitle("🌾 " + c.getCropName() + " (" + (c.getVariety() != null ? c.getVariety() : "Fresh") + ")");
                    op.setDescription(c.getQuantityQuintals() + " Quintals available direct from farmer gate @ ₹" + c.getExpectedPricePerQuintal() + "/qtl.");
                    op.setRequesterOrProviderName(c.getFarmer().getFullName());
                    op.setRoleBadge("🌾 Verified Farmer");
                    op.setLocation(c.getVillageOrTown() + ", " + c.getDistrict());
                    op.setDistanceKm(calculateMockDistance(userVillage, c.getVillageOrTown()));
                    op.setMatchScore(96.0);
                    op.setMatchReasons(Arrays.asList("Direct Farm Gate Price", "Grade A Quality", "Local Delivery Available"));
                    op.setPrice(c.getExpectedPricePerQuintal() != null ? c.getExpectedPricePerQuintal() / 100.0 : 25.0);
                    op.setPriceUnit("₹ / kg");
                    op.setActionType("BUY");
                    op.setEntityId(c.getId());
                    op.setEntityType("CROP");
                    op.getMetadata().put("quantityQuintals", c.getQuantityQuintals());
                    cards.add(op);
                }
            }

            // Also show available transport providers nearby
            List<Vehicle> nearbyVehicles = vehicleRepository.findByServiceDistrictIgnoreCaseAndActiveTrue(userDist);
            for (Vehicle v : nearbyVehicles) {
                OpportunityCard op = new OpportunityCard();
                op.setId("veh-" + v.getId());
                op.setType("TRANSPORT_AVAILABLE");
                op.setTitle("🚚 " + v.getModelName() + " (" + v.getVehicleType() + ")");
                op.setDescription("Available for farm-to-door crop hauling. Capacity: " + v.getCapacityTons() + " Tons.");
                op.setRequesterOrProviderName(v.getProvider() != null ? v.getProvider().getFullName() : "Transporter");
                op.setRoleBadge("🚜 Transport Provider");
                op.setLocation(v.getServiceVillage() + ", " + v.getServiceDistrict());
                op.setDistanceKm(calculateMockDistance(userVillage, v.getServiceVillage()));
                op.setMatchScore(92.0);
                op.setMatchReasons(Arrays.asList("Verified Fleet", "GPS Route Enabled", "Standard ₹" + v.getPricePerKm() + "/km"));
                op.setPrice(v.getBasePrice());
                op.setPriceUnit("₹ Base Fare");
                op.setActionType("BOOK_TRANSPORT");
                op.setEntityId(v.getId());
                op.setEntityType("VEHICLE");
                cards.add(op);
            }
        }

        // 2. FOR FARMERS: Show crop purchase demands from buyers, available tractors/harvesters, and transport providers
        if (isFarmer) {
            // Check buyer purchase orders on farmer's crops
            List<CropOrder> incomingOrders = cropOrderRepository.findByFarmerIdOrderByCreatedAtDesc(user.getId());
            for (CropOrder co : incomingOrders) {
                if (co.getOrderStatus() == CropOrderStatus.REQUESTED) {
                    OpportunityCard op = new OpportunityCard();
                    op.setId("order-" + co.getId());
                    op.setType("CROP_BUYER_DEMAND");
                    op.setTitle("🛍️ Purchase Request: " + co.getQuantityQuintals() + " Qtl " + (co.getCrop() != null ? co.getCrop().getCropName() : "Produce"));
                    op.setDescription((co.getBuyer() != null ? co.getBuyer().getFullName() : "Buyer") + " offered ₹" + co.getAgreedPricePerQuintal() + "/qtl. Total ₹" + co.getTotalAmount());
                    op.setRequesterOrProviderName(co.getBuyer() != null ? co.getBuyer().getFullName() : "Citizen Buyer");
                    op.setRoleBadge("👤 Verified Citizen Buyer");
                    op.setLocation(co.getDeliveryVillage() != null ? co.getDeliveryVillage() + ", " + co.getDeliveryDistrict() : userDist);
                    op.setDistanceKm(3.5);
                    op.setMatchScore(98.0);
                    op.setMatchReasons(Arrays.asList("Immediate Payment Ready", "Fair Mandi Rate", "Within Local Area"));
                    op.setPrice(co.getTotalAmount());
                    op.setPriceUnit("₹ Total");
                    op.setActionType("ACCEPT_OR_COUNTER");
                    op.setEntityId(co.getId());
                    op.setEntityType("CROP_ORDER");
                    cards.add(op);
                }
            }

            // Available Tractors & Harvesters (Supply)
            List<Resource> agriMachines = resourceRepository.findAll().stream()
                    .filter(Resource::isAvailable)
                    .toList();
            for (Resource r : agriMachines) {
                OpportunityCard op = new OpportunityCard();
                op.setId("res-" + r.getId());
                op.setType("TRACTOR_AVAILABLE");
                op.setTitle("🚜 " + r.getName());
                op.setDescription(r.getDescription() != null ? r.getDescription() : "High-power machinery ready for field operations.");
                op.setRequesterOrProviderName(r.getOwner() != null ? r.getOwner().getFullName() : "Equipment Provider");
                op.setRoleBadge("🚜 Machinery Pool");
                op.setLocation(r.getVillageOrTown() + ", " + r.getDistrict());
                op.setDistanceKm(calculateMockDistance(userVillage, r.getVillageOrTown()));
                op.setMatchScore(94.0);
                op.setMatchReasons(Arrays.asList("GPS Location Verified", "Operator Included", "Fuel Efficient"));
                op.setPrice(r.getCostPerUnit() != null ? r.getCostPerUnit() : 800.0);
                op.setPriceUnit(r.getCostUnit() != null ? r.getCostUnit() : "₹/hour");
                op.setActionType("BOOK_MACHINERY");
                op.setEntityId(r.getId());
                op.setEntityType("RESOURCE");
                cards.add(op);
            }
        }

        // 3. FOR TRANSPORT & EQUIPMENT PROVIDERS: Show live pending transport & farm jobs nearby
        if (isProvider) {
            List<TransportRequest> openTrips = transportRequestRepository.findActiveRequestsNearDistrict(userDist);
            for (TransportRequest tr : openTrips) {
                if (tr.getAssignedProvider() == null) {
                    OpportunityCard op = new OpportunityCard();
                    op.setId("trip-" + tr.getId());
                    op.setType("TRANSPORT_NEEDED");
                    op.setTitle("📦 Haul " + tr.getQuantityQuintals() + " Qtl " + tr.getCargoType());
                    op.setDescription("Route: " + tr.getPickupVillage() + " → " + tr.getDestinationVillage() + " (Date: " + tr.getRequiredDate() + ")");
                    op.setRequesterOrProviderName(tr.getRequester().getFullName());
                    op.setRoleBadge(tr.getLinkedCropOrderId() != null ? "🌾 Kisan Direct Crop" : "👤 Citizen Goods");
                    op.setLocation(tr.getPickupVillage() + " to " + tr.getDestinationVillage());
                    op.setDistanceKm(calculateMockDistance(userVillage, tr.getPickupVillage()));
                    op.setMatchScore(95.0);
                    op.setMatchReasons(Arrays.asList("Ready for Pickup", "Budget ₹" + tr.getBudgetAmount(), "Within Radius"));
                    op.setPrice(tr.getBudgetAmount());
                    op.setPriceUnit("₹ Offered Fare");
                    op.setActionType("ACCEPT_JOB");
                    op.setEntityId(tr.getId());
                    op.setEntityType("TRANSPORT_REQUEST");
                    cards.add(op);
                }
            }

            // Also check open problems in the district
            List<Problem> openProblems = problemRepository.findByDistrictIgnoreCase(userDist);
            for (Problem p : openProblems) {
                if (p.getStatus() != ProblemStatus.CLOSED && p.getStatus() != ProblemStatus.REJECTED) {
                    OpportunityCard op = new OpportunityCard();
                    op.setId("prob-" + p.getId());
                    op.setType("TRACTOR_NEEDED");
                    op.setTitle("🚜 " + p.getTitle());
                    op.setDescription(p.getRawDescription());
                    op.setRequesterOrProviderName(p.getUser() != null ? p.getUser().getFullName() : "Farmer");
                    op.setRoleBadge("🌾 Kisan Request");
                    op.setLocation(p.getVillageOrTown() + ", " + p.getDistrict());
                    op.setDistanceKm(calculateMockDistance(userVillage, p.getVillageOrTown()));
                    op.setMatchScore(90.0);
                    op.setMatchReasons(Arrays.asList("Urgent Service", "High Demand Block", "Verified Budget"));
                    op.setPrice(p.getBudgetAmount() != null ? p.getBudgetAmount() : 2500.0);
                    op.setPriceUnit("₹ Estimated");
                    op.setActionType("ACCEPT_JOB");
                    op.setEntityId(p.getId());
                    op.setEntityType("PROBLEM");
                    cards.add(op);
                }
            }
        }

        // 4. FOR VILLAGE MITRA: Show unassigned coordination cases, unmet gaps, and escalations
        if (isMitra) {
            List<CoordinationRequest> unassigned = coordinationRepository.findByStatusOrderByCreatedAtDesc("PENDING");
            for (CoordinationRequest cr : unassigned) {
                OpportunityCard op = new OpportunityCard();
                op.setId("coord-" + cr.getId());
                op.setType("MITRA_COORDINATION");
                op.setTitle("🌟 " + cr.getCoordinationType() + " Coordination Needed");
                op.setDescription("Requester: " + (cr.getRequester() != null ? cr.getRequester().getFullName() : "Resident") + " • Details: " + cr.getDescription());
                op.setRequesterOrProviderName(cr.getRequester() != null ? cr.getRequester().getFullName() : "Community Member");
                op.setRoleBadge("🚨 Unmatched Need");
                op.setLocation(cr.getVillage() + ", " + cr.getBlock());
                op.setDistanceKm(2.1);
                op.setMatchScore(100.0);
                op.setMatchReasons(Arrays.asList("No Provider Matched Automatically", "Assigned Jurisdiction", "SLA: 24h Target"));
                op.setActionType("COORDINATE");
                op.setEntityId(cr.getId());
                op.setEntityType("COORDINATION");
                cards.add(op);
            }
        }

        return cards.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * 1-Click Linked Transport Creation for a Crop Order.
     * Links Crop Order ID, Farmer ID, Citizen ID, Pickup Location, Destination, Quantity, and Weight.
     */
    @Transactional
    public TransportRequestDto createLinkedTransportForCropOrder(Long requesterId, Long cropOrderId, Double budgetAmount, String preferredVehicleType) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CropOrder order = cropOrderRepository.findById(cropOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop order not found"));

        CreateTransportRequest req = new CreateTransportRequest();
        req.setCargoType("Fresh Harvest (" + order.getCrop().getCropName() + ")");
        req.setCargoDescription("Transport of " + order.getQuantityQuintals() + " Qtl " + order.getCrop().getCropName() + " from farm gate to buyer doorstep.");
        req.setQuantityQuintals(order.getQuantityQuintals());
        req.setWeightTons(order.getQuantityQuintals() / 10.0);

        // Pickup is Farmer's Farm Location
        Crop crop = order.getCrop();
        req.setPickupVillage(crop.getVillageOrTown() != null ? crop.getVillageOrTown() : "Gharuan");
        req.setPickupDistrict(crop.getDistrict() != null ? crop.getDistrict() : "Mohali");
        req.setPickupState(crop.getState() != null ? crop.getState() : "Punjab");
        req.setPickupLatitude(crop.getLatitude() != null ? crop.getLatitude() : 30.7499);
        req.setPickupLongitude(crop.getLongitude() != null ? crop.getLongitude() : 76.6411);

        // Destination is Buyer's Delivery Location
        req.setDestinationVillage(order.getDeliveryVillage() != null ? order.getDeliveryVillage() : "Kharar");
        req.setDestinationBlock(order.getDeliveryBlock() != null ? order.getDeliveryBlock() : "Kharar");
        req.setDestinationDistrict(order.getDeliveryDistrict() != null ? order.getDeliveryDistrict() : "Mohali");
        req.setDestinationState(order.getDeliveryState() != null ? order.getDeliveryState() : "Punjab");

        req.setRequiredDate(order.getPreferredDeliveryDate() != null ? order.getPreferredDeliveryDate() : LocalDate.now().plusDays(1));
        req.setStartTime(LocalTime.of(9, 0));
        req.setEndTime(LocalTime.of(15, 0));
        req.setPreferredVehicleType(preferredVehicleType != null ? VehicleType.valueOf(preferredVehicleType) : VehicleType.PICKUP);
        req.setBudgetAmount(budgetAmount != null && budgetAmount > 0 ? budgetAmount : 1500.0);
        req.setLinkedCropOrderId(order.getId());
        req.setDriverRequired(true);
        req.setLoadingRequired(true);

        TransportRequestDto created = transportService.createTransportRequest(requester.getId(), req);

        // Update crop order status to indicate linked transport is requested
        order.setDeliveryPreference("LINKED_TRANSPORT_REQUESTED");
        cropOrderRepository.save(order);

        log.info("🔗 [LINKED TRANSACTION] Crop Order #{} linked to Transport Request #{}", order.getId(), created.getId());
        return created;
    }

    /**
     * Unified Counter-Offer Handler for Transport, Machinery, and Crops.
     */
    @Transactional
    public Object submitCounterOffer(Long userId, String entityType, Long entityId, Double counterPrice, String notes, LocalDate counterDate, LocalTime start, LocalTime end) {
        if ("TRANSPORT".equalsIgnoreCase(entityType) || "TRANSPORT_REQUEST".equalsIgnoreCase(entityType)) {
            TransportCounterOfferRequest req = new TransportCounterOfferRequest();
            req.setCounterPrice(counterPrice);
            req.setNotes(notes);
            req.setCounterDate(counterDate);
            req.setCounterStartTime(start);
            req.setCounterEndTime(end);
            return transportService.counterOffer(userId, entityId, req);
        } else if ("CROP".equalsIgnoreCase(entityType) || "CROP_ORDER".equalsIgnoreCase(entityType)) {
            CropOrderCounterRequest req = new CropOrderCounterRequest();
            req.setCounterPricePerQuintal(counterPrice);
            req.setCounterNotes(notes);
            return cropOrderService.counterOffer(userId, entityId, req);
        }
        throw new IllegalArgumentException("Unsupported entityType for counter offer: " + entityType);
    }

    /**
     * 1-Click Human Coordination Fallback to Village Mitra when automated matching finds no providers.
     */
    @Transactional
    public CoordinationRequest requestMitraFallback(Long requesterId, String requirementType, String description, Double lat, Double lon, String village, String block, String district) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        VillageMitraDto nearestMitra = villageMitraService.findNearestVillageMitra(lat, lon, village, block, district);

        String v = village != null ? village : (requester.getProfile() != null ? requester.getProfile().getVillageOrTown() : "Gharuan");
        String d = district != null ? district : (requester.getProfile() != null ? requester.getProfile().getDistrict() : "Mohali");

        RequestAssistanceRequest req = new RequestAssistanceRequest();
        req.setCoordinationType(requirementType != null ? requirementType : "TRANSPORT_COORDINATION");
        req.setTitle(requirementType != null ? requirementType : "Machinery / Transport Shortage");
        req.setDescription(description != null ? description : "Automated matching could not find immediate provider nearby. Need local human coordination.");
        req.setVillage(v);
        req.setBlock(block != null ? block : "Kharar");
        req.setDistrict(d);
        req.setState("Punjab");
        req.setLatitude(lat);
        req.setLongitude(lon);

        CoordinationRequest created = villageMitraService.requestAssistance(requester.getId(), req);
        log.info("🌟 [MITRA FALLBACK] Dispatched unfulfilled {} request to Village Mitra ({})", requirementType, nearestMitra.getFullName());
        return created;
    }

    private double calculateMockDistance(String origin, String dest) {
        if (origin == null || dest == null) return 4.2;
        if (origin.equalsIgnoreCase(dest)) return 1.5;
        return 3.5 + Math.abs((origin.hashCode() % 10)) * 0.8;
    }
}
