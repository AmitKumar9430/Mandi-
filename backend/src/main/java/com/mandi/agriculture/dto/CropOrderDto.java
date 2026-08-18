package com.mandi.agriculture.dto;

import com.mandi.agriculture.CropOrder;
import com.mandi.agriculture.CropOrderStatus;

import java.time.LocalDate;

public class CropOrderDto {
    private Long id;
    private Long cropId;
    private String cropName;
    private String cropVariety;
    private Long buyerId;
    private String buyerName;
    private String buyerPhone;
    private Long farmerId;
    private String farmerName;
    private String farmerPhone;
    private Double quantityQuintals;
    private Double agreedPricePerQuintal;
    private Double totalAmount;
    private CropOrderStatus orderStatus;
    private String deliveryPreference;
    private LocalDate preferredDeliveryDate;
    private String deliveryVillage;
    private String deliveryBlock;
    private String deliveryDistrict;
    private String deliveryState;
    private String deliveryAddress;
    private Double counterPricePerQuintal;
    private String counterNotes;
    private Long linkedTransportRequestId;
    private Long linkedTransportBookingId;
    private Integer buyerRating;
    private String buyerFeedback;
    private Integer farmerRating;
    private String farmerFeedback;

    public static CropOrderDto fromEntity(CropOrder co) {
        if (co == null) return null;
        CropOrderDto dto = new CropOrderDto();
        dto.setId(co.getId());
        if (co.getCrop() != null) {
            dto.setCropId(co.getCrop().getId());
            dto.setCropName(co.getCrop().getCropName());
            dto.setCropVariety(co.getCrop().getVariety());
        }
        if (co.getBuyer() != null) {
            dto.setBuyerId(co.getBuyer().getId());
            dto.setBuyerName(co.getBuyer().getFullName());
            dto.setBuyerPhone(co.getBuyer().getPhone());
        }
        if (co.getFarmer() != null) {
            dto.setFarmerId(co.getFarmer().getId());
            dto.setFarmerName(co.getFarmer().getFullName());
            dto.setFarmerPhone(co.getFarmer().getPhone());
        }
        dto.setQuantityQuintals(co.getQuantityQuintals());
        dto.setAgreedPricePerQuintal(co.getAgreedPricePerQuintal());
        dto.setTotalAmount(co.getTotalAmount());
        dto.setOrderStatus(co.getOrderStatus());
        dto.setDeliveryPreference(co.getDeliveryPreference());
        dto.setPreferredDeliveryDate(co.getPreferredDeliveryDate());
        dto.setDeliveryVillage(co.getDeliveryVillage());
        dto.setDeliveryBlock(co.getDeliveryBlock());
        dto.setDeliveryDistrict(co.getDeliveryDistrict());
        dto.setDeliveryState(co.getDeliveryState());
        dto.setDeliveryAddress(co.getDeliveryAddress());
        dto.setCounterPricePerQuintal(co.getCounterPricePerQuintal());
        dto.setCounterNotes(co.getCounterNotes());
        dto.setLinkedTransportRequestId(co.getLinkedTransportRequestId());
        dto.setLinkedTransportBookingId(co.getLinkedTransportBookingId());
        dto.setBuyerRating(co.getBuyerRating());
        dto.setBuyerFeedback(co.getBuyerFeedback());
        dto.setFarmerRating(co.getFarmerRating());
        dto.setFarmerFeedback(co.getFarmerFeedback());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCropId() { return cropId; }
    public void setCropId(Long cropId) { this.cropId = cropId; }
    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    public String getCropVariety() { return cropVariety; }
    public void setCropVariety(String cropVariety) { this.cropVariety = cropVariety; }
    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }
    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
    public String getFarmerPhone() { return farmerPhone; }
    public void setFarmerPhone(String farmerPhone) { this.farmerPhone = farmerPhone; }
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
