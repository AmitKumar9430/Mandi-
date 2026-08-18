package com.mandi.agriculture.dto;

import java.time.LocalDate;

public class CreateCropOrderRequest {
    private Long cropId;
    private Double quantityQuintals;
    private Double offeredPricePerQuintal;
    private String deliveryPreference = "DELIVERY"; // PICKUP, DELIVERY
    private LocalDate preferredDeliveryDate;
    private String deliveryVillage;
    private String deliveryBlock;
    private String deliveryDistrict;
    private String deliveryState;
    private String deliveryAddress;
    private boolean requestTransport = false;

    public Long getCropId() { return cropId; }
    public void setCropId(Long cropId) { this.cropId = cropId; }
    public Double getQuantityQuintals() { return quantityQuintals; }
    public void setQuantityQuintals(Double quantityQuintals) { this.quantityQuintals = quantityQuintals; }
    public Double getOfferedPricePerQuintal() { return offeredPricePerQuintal; }
    public void setOfferedPricePerQuintal(Double offeredPricePerQuintal) { this.offeredPricePerQuintal = offeredPricePerQuintal; }
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
    public boolean isRequestTransport() { return requestTransport; }
    public void setRequestTransport(boolean requestTransport) { this.requestTransport = requestTransport; }
}
