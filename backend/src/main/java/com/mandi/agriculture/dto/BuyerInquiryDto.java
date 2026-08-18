package com.mandi.agriculture.dto;

import com.mandi.agriculture.BuyerInquiry;
import java.time.Instant;

public class BuyerInquiryDto {
    private Long id;
    private Long cropId;
    private String cropName;
    private Long buyerId;
    private String buyerName;
    private Double offeredPricePerQuintal;
    private Double requestedQuantityQuintals;
    private String message;
    private String contactPhone;
    private String status;
    private Instant createdAt;

    public BuyerInquiryDto() {}

    public static BuyerInquiryDto from(BuyerInquiry inquiry) {
        BuyerInquiryDto dto = new BuyerInquiryDto();
        dto.setId(inquiry.getId());
        if (inquiry.getCrop() != null) {
            dto.setCropId(inquiry.getCrop().getId());
            dto.setCropName(inquiry.getCrop().getCropName());
        }
        if (inquiry.getBuyer() != null) {
            dto.setBuyerId(inquiry.getBuyer().getId());
            dto.setBuyerName(inquiry.getBuyer().getFullName());
        }
        dto.setOfferedPricePerQuintal(inquiry.getOfferedPricePerQuintal());
        dto.setRequestedQuantityQuintals(inquiry.getRequestedQuantityQuintals());
        dto.setMessage(inquiry.getMessage());
        dto.setContactPhone(inquiry.getContactPhone());
        dto.setStatus(inquiry.getStatus());
        dto.setCreatedAt(inquiry.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCropId() { return cropId; }
    public void setCropId(Long cropId) { this.cropId = cropId; }
    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public Double getOfferedPricePerQuintal() { return offeredPricePerQuintal; }
    public void setOfferedPricePerQuintal(Double offeredPricePerQuintal) { this.offeredPricePerQuintal = offeredPricePerQuintal; }
    public Double getRequestedQuantityQuintals() { return requestedQuantityQuintals; }
    public void setRequestedQuantityQuintals(Double requestedQuantityQuintals) { this.requestedQuantityQuintals = requestedQuantityQuintals; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
