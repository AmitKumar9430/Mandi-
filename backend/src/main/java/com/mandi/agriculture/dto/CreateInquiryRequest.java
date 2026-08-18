package com.mandi.agriculture.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateInquiryRequest {

    @NotNull(message = "Offered price per quintal is required")
    @Positive(message = "Offered price must be greater than 0")
    private Double offeredPricePerQuintal;

    @NotNull(message = "Requested quantity is required")
    @Positive(message = "Requested quantity must be greater than 0")
    private Double requestedQuantityQuintals;

    private String message;
    private String contactPhone;

    public CreateInquiryRequest() {}

    public Double getOfferedPricePerQuintal() { return offeredPricePerQuintal; }
    public void setOfferedPricePerQuintal(Double offeredPricePerQuintal) { this.offeredPricePerQuintal = offeredPricePerQuintal; }
    public Double getRequestedQuantityQuintals() { return requestedQuantityQuintals; }
    public void setRequestedQuantityQuintals(Double requestedQuantityQuintals) { this.requestedQuantityQuintals = requestedQuantityQuintals; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
