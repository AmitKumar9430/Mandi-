package com.mandi.agriculture;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "buyer_inquiries", indexes = {
        @Index(name = "idx_inquiry_crop", columnList = "crop_id"),
        @Index(name = "idx_inquiry_buyer", columnList = "buyer_user_id")
})
public class BuyerInquiry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_user_id", nullable = false)
    private User buyer;

    @Column(nullable = false)
    private Double offeredPricePerQuintal;

    @Column(nullable = false)
    private Double requestedQuantityQuintals;

    @Column(length = 1000)
    private String message;

    @Column(length = 50)
    private String contactPhone;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, NEGOTIATING

    public BuyerInquiry() {}

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }
    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }
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
}
