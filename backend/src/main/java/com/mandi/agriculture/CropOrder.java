package com.mandi.agriculture;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "crop_orders", indexes = {
        @Index(name = "idx_co_buyer", columnList = "buyer_user_id"),
        @Index(name = "idx_co_farmer", columnList = "farmer_user_id"),
        @Index(name = "idx_co_crop", columnList = "crop_id"),
        @Index(name = "idx_co_status", columnList = "orderStatus")
})
public class CropOrder extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_user_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_user_id", nullable = false)
    private User farmer;

    @Column(nullable = false)
    private Double quantityQuintals;

    @Column(nullable = false)
    private Double agreedPricePerQuintal;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private CropOrderStatus orderStatus = CropOrderStatus.REQUESTED;

    @Column(length = 30)
    private String deliveryPreference = "DELIVERY"; // PICKUP, DELIVERY

    private LocalDate preferredDeliveryDate;

    // Delivery location
    @Column(length = 100)
    private String deliveryVillage;

    @Column(length = 100)
    private String deliveryBlock;

    @Column(length = 100)
    private String deliveryDistrict;

    @Column(length = 60)
    private String deliveryState;

    @Column(length = 300)
    private String deliveryAddress;

    private Double counterPricePerQuintal;

    @Column(length = 300)
    private String counterNotes;

    private Long linkedTransportRequestId;
    private Long linkedTransportBookingId;

    private Integer buyerRating;
    @Column(length = 500)
    private String buyerFeedback;

    private Integer farmerRating;
    @Column(length = 500)
    private String farmerFeedback;

    public CropOrder() {}

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }

    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }

    public User getFarmer() { return farmer; }
    public void setFarmer(User farmer) { this.farmer = farmer; }

    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }

    public Double getAgreedPricePerQuintal() { return agreedPricePerQuintal; }
    public void setAgreedPricePerQuintal(Double agreedPricePerQuintal) { this.agreedPricePerQuintal = agreedPricePerQuintal; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public CropOrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(CropOrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public String getDeliveryPreference() { return deliveryPreference; }
    public void setDeliveryPreference(String deliveryPreference) { this.deliveryPreference = deliveryPreference; }

    public LocalDate getPreferredDeliveryDate() { return preferredDeliveryDate; }
    public void setPreferredDeliveryDate(LocalDate preferredDeliveryDate) { this.preferredDeliveryDate = preferredDeliveryDate; }

    public String getDeliveryVillage() { return deliveryVillage; }
    public void setDeliveryVillage(String deliveryVillage) { this.deliveryVillage = deliveryVillage; }

    public String getDeliveryBlock() { return deliveryBlock; }
    public void setDeliveryBlock(String deliveryBlock) { this.deliveryBlock = deliveryBlock; }

    public String getDeliveryDistrict() { return deliveryDistrict; }
    public void setDeliveryDistrict(String deliveryDistrict) { this.deliveryDistrict = deliveryDistrict; }

    public String getDeliveryState() { return deliveryState; }
    public void setDeliveryState(String deliveryState) { this.deliveryState = deliveryState; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Double getCounterPricePerQuintal() { return counterPricePerQuintal; }
    public void setCounterPricePerQuintal(Double counterPricePerQuintal) { this.counterPricePerQuintal = counterPricePerQuintal; }

    public String getCounterNotes() { return counterNotes; }
    public void setCounterNotes(String counterNotes) { this.counterNotes = counterNotes; }

    public Long getLinkedTransportRequestId() { return linkedTransportRequestId; }
    public void setLinkedTransportRequestId(Long linkedTransportRequestId) { this.linkedTransportRequestId = linkedTransportRequestId; }

    public Long getLinkedTransportBookingId() { return linkedTransportBookingId; }
    public void setLinkedTransportBookingId(Long linkedTransportBookingId) { this.linkedTransportBookingId = linkedTransportBookingId; }

    public Integer getBuyerRating() { return buyerRating; }
    public void setBuyerRating(Integer buyerRating) { this.buyerRating = buyerRating; }

    public String getBuyerFeedback() { return buyerFeedback; }
    public void setBuyerFeedback(String buyerFeedback) { this.buyerFeedback = buyerFeedback; }

    public Integer getFarmerRating() { return farmerRating; }
    public void setFarmerRating(Integer farmerRating) { this.farmerRating = farmerRating; }

    public String getFarmerFeedback() { return farmerFeedback; }
    public void setFarmerFeedback(String farmerFeedback) { this.farmerFeedback = farmerFeedback; }
}
