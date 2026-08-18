package com.mandi.agriculture.dto;

public class CropOrderCounterRequest {
    private Double counterPricePerQuintal;
    private String counterNotes;

    public Double getCounterPricePerQuintal() { return counterPricePerQuintal; }
    public void setCounterPricePerQuintal(Double counterPricePerQuintal) { this.counterPricePerQuintal = counterPricePerQuintal; }
    public String getCounterNotes() { return counterNotes; }
    public void setCounterNotes(String counterNotes) { this.counterNotes = counterNotes; }
}
