package com.mandi.agriculture;

import com.mandi.agriculture.dto.CreateCropOrderRequest;
import com.mandi.agriculture.dto.CropOrderCounterRequest;
import com.mandi.agriculture.dto.CropOrderDto;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.notification.NotificationService;
import com.mandi.user.User;
import com.mandi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CropOrderService {

    private final CropOrderRepository cropOrderRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CropOrderService(CropOrderRepository cropOrderRepository,
                            CropRepository cropRepository,
                            UserRepository userRepository,
                            NotificationService notificationService) {
        this.cropOrderRepository = cropOrderRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public CropOrderDto createOrder(Long buyerId, CreateCropOrderRequest req) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));
        Crop crop = cropRepository.findById(req.getCropId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop listing not found"));

        if (req.getQuantityQuintals() == null || req.getQuantityQuintals() <= 0) {
            throw new IllegalArgumentException("Order quantity must be greater than zero.");
        }

        // Concurrency & Stock Validation
        double available = crop.getQuantityQuintals() != null ? crop.getQuantityQuintals() : 0.0;
        if (available < req.getQuantityQuintals()) {
            throw new IllegalStateException("Insufficient crop stock: Only " + available + " quintals available.");
        }

        // Atomically decrement available stock
        double remaining = available - req.getQuantityQuintals();
        crop.setQuantityQuintals(remaining);
        if (remaining <= 0) {
            crop.setStatus("SOLD");
        }
        cropRepository.save(crop);

        double pricePerQtl = req.getOfferedPricePerQuintal() != null && req.getOfferedPricePerQuintal() > 0
                ? req.getOfferedPricePerQuintal()
                : crop.getExpectedPricePerQuintal();
        double total = pricePerQtl * req.getQuantityQuintals();

        CropOrder order = new CropOrder();
        order.setCrop(crop);
        order.setBuyer(buyer);
        order.setFarmer(crop.getFarmer());
        order.setQuantityQuintals(req.getQuantityQuintals());
        order.setAgreedPricePerQuintal(pricePerQtl);
        order.setTotalAmount(total);
        order.setOrderStatus(CropOrderStatus.REQUESTED);
        order.setDeliveryPreference(req.getDeliveryPreference() != null ? req.getDeliveryPreference() : "DELIVERY");
        order.setPreferredDeliveryDate(req.getPreferredDeliveryDate());
        order.setDeliveryVillage(req.getDeliveryVillage());
        order.setDeliveryBlock(req.getDeliveryBlock());
        order.setDeliveryDistrict(req.getDeliveryDistrict());
        order.setDeliveryState(req.getDeliveryState());
        order.setDeliveryAddress(req.getDeliveryAddress());

        CropOrder saved = cropOrderRepository.save(order);

        // Notify farmer
        try {
            notificationService.createNotification(
                    crop.getFarmer().getId(),
                    "🌾 New Crop Purchase Request",
                    buyer.getFullName() + " requested to buy " + req.getQuantityQuintals() +
                            " qtl of " + crop.getCropName() + " (Total: ₹" + total + ")",
                    "CROP_ORDER",
                    saved.getId()
            );
        } catch (Exception ignored) {}

        return CropOrderDto.fromEntity(saved);
    }

    @Transactional
    public CropOrderDto acceptOrder(Long farmerId, Long orderId) {
        CropOrder order = cropOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getFarmer() != null && !order.getFarmer().getId().equals(farmerId)) {
            User u = userRepository.findById(farmerId).orElse(null);
            boolean isAuthorized = u != null && u.getRoles() != null &&
                    u.getRoles().stream().anyMatch(r -> r.name().contains("ADMIN") || r.name().contains("FARMER"));
            if (!isAuthorized) {
                throw new IllegalStateException("Unauthorized: only the crop farmer can accept this order.");
            }
        }
        order.setOrderStatus(CropOrderStatus.FARMER_ACCEPTED);
        CropOrder saved = cropOrderRepository.save(order);

        try {
            if (order.getBuyer() != null) {
                String farmerName = order.getFarmer() != null ? order.getFarmer().getFullName() : "Farmer";
                notificationService.createNotification(
                        order.getBuyer().getId(),
                        "✅ Farmer Accepted Your Crop Order",
                        "Farmer " + farmerName + " accepted your order for " +
                                order.getQuantityQuintals() + " qtl of " + order.getCrop().getCropName(),
                        "CROP_ORDER",
                        saved.getId()
                );
            }
        } catch (Exception ignored) {}

        return CropOrderDto.fromEntity(saved);
    }

    @Transactional
    public CropOrderDto counterOffer(Long farmerId, Long orderId, CropOrderCounterRequest req) {
        CropOrder order = cropOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getFarmer().getId().equals(farmerId)) {
            throw new IllegalStateException("Unauthorized to counter offer.");
        }
        order.setCounterPricePerQuintal(req.getCounterPricePerQuintal());
        order.setCounterNotes(req.getCounterNotes());
        order.setOrderStatus(CropOrderStatus.COUNTER_OFFERED);
        CropOrder saved = cropOrderRepository.save(order);

        try {
            notificationService.createNotification(
                    order.getBuyer().getId(),
                    "💬 Counter Offer on Crop Order",
                    order.getFarmer().getFullName() + " countered with ₹" +
                            req.getCounterPricePerQuintal() + "/qtl: " + req.getCounterNotes(),
                    "CROP_ORDER",
                    saved.getId()
            );
        } catch (Exception ignored) {}

        return CropOrderDto.fromEntity(saved);
    }

    @Transactional
    public CropOrderDto confirmCounterOffer(Long buyerId, Long orderId) {
        CropOrder order = cropOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getBuyer().getId().equals(buyerId)) {
            throw new IllegalStateException("Unauthorized to confirm counter offer.");
        }
        if (order.getCounterPricePerQuintal() != null) {
            order.setAgreedPricePerQuintal(order.getCounterPricePerQuintal());
            order.setTotalAmount(order.getCounterPricePerQuintal() * order.getQuantityQuintals());
        }
        order.setOrderStatus(CropOrderStatus.CONFIRMED);
        CropOrder saved = cropOrderRepository.save(order);

        try {
            notificationService.createNotification(
                    order.getFarmer().getId(),
                    "🎉 Crop Order Confirmed!",
                    order.getBuyer().getFullName() + " accepted your counter price. Order is now CONFIRMED.",
                    "CROP_ORDER",
                    saved.getId()
            );
        } catch (Exception ignored) {}

        return CropOrderDto.fromEntity(saved);
    }

    @Transactional
    public CropOrderDto markReady(Long farmerId, Long orderId) {
        CropOrder order = cropOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getFarmer().getId().equals(farmerId)) {
            throw new IllegalStateException("Unauthorized.");
        }
        order.setOrderStatus(CropOrderStatus.READY_FOR_PICKUP);
        return CropOrderDto.fromEntity(cropOrderRepository.save(order));
    }

    @Transactional
    public CropOrderDto completeOrder(Long buyerId, Long orderId) {
        CropOrder order = cropOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getBuyer().getId().equals(buyerId)) {
            throw new IllegalStateException("Unauthorized to complete order.");
        }
        order.setOrderStatus(CropOrderStatus.COMPLETED);
        return CropOrderDto.fromEntity(cropOrderRepository.save(order));
    }

    @Transactional
    public CropOrderDto rateOrder(Long userId, Long orderId, int rating, String feedback) {
        CropOrder order = cropOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getBuyer().getId().equals(userId)) {
            order.setBuyerRating(rating);
            order.setBuyerFeedback(feedback);
            order.setOrderStatus(CropOrderStatus.RATED);
        } else if (order.getFarmer().getId().equals(userId)) {
            order.setFarmerRating(rating);
            order.setFarmerFeedback(feedback);
        } else {
            throw new IllegalStateException("Unauthorized to rate order.");
        }
        return CropOrderDto.fromEntity(cropOrderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<CropOrderDto> getBuyerOrders(Long buyerId) {
        return cropOrderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream().map(CropOrderDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CropOrderDto> getFarmerOrders(Long farmerId) {
        return cropOrderRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream().map(CropOrderDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CropOrderDto getOrderById(Long orderId) {
        return cropOrderRepository.findById(orderId)
                .map(CropOrderDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Crop order not found"));
    }
}
