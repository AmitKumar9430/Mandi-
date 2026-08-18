package com.mandi.mitra.dto;

public class EscalationRequest {
    private String targetLevel; // BLOCK, DISTRICT, ADMIN
    private String reason;
    private String notes;

    public String getTargetLevel() { return targetLevel; }
    public void setTargetLevel(String targetLevel) { this.targetLevel = targetLevel; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
