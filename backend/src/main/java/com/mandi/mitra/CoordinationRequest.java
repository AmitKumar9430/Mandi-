package com.mandi.mitra;

import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "coordination_requests", indexes = {
        @Index(name = "idx_coord_mitra", columnList = "mitra_user_id"),
        @Index(name = "idx_coord_requester", columnList = "requester_user_id"),
        @Index(name = "idx_coord_status", columnList = "status"),
        @Index(name = "idx_coord_district", columnList = "district")
})
public class CoordinationRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_user_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mitra_user_id")
    private User mitra;

    @Column(nullable = false, length = 60)
    private String coordinationType; // TRANSPORT_COORDINATION, TRACTOR_ASSISTANCE, CROP_SALE, CIVIC_PROBLEM, DIGITAL_HELP, EMERGENCY

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String village;

    @Column(length = 100)
    private String block;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 60)
    private String state;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, IN_COORDINATION, COMPLETED, ESCALATED, CANCELLED

    @Column(length = 30)
    private String escalationLevel = "VILLAGE"; // VILLAGE, BLOCK, DISTRICT, ADMIN

    @Column(length = 500)
    private String escalationReason;

    @Column(length = 1000)
    private String mitraNotes;

    private Long linkedProblemId;
    private Long linkedTransportRequestId;
    private Long linkedCropOrderId;
    private Long linkedBookingId;

    public CoordinationRequest() {}

    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }

    public User getMitra() { return mitra; }
    public void setMitra(User mitra) { this.mitra = mitra; }

    public String getCoordinationType() { return coordinationType; }
    public void setCoordinationType(String coordinationType) { this.coordinationType = coordinationType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(String escalationLevel) { this.escalationLevel = escalationLevel; }

    public String getEscalationReason() { return escalationReason; }
    public void setEscalationReason(String escalationReason) { this.escalationReason = escalationReason; }

    public String getMitraNotes() { return mitraNotes; }
    public void setMitraNotes(String mitraNotes) { this.mitraNotes = mitraNotes; }

    public Long getLinkedProblemId() { return linkedProblemId; }
    public void setLinkedProblemId(Long linkedProblemId) { this.linkedProblemId = linkedProblemId; }

    public Long getLinkedTransportRequestId() { return linkedTransportRequestId; }
    public void setLinkedTransportRequestId(Long linkedTransportRequestId) { this.linkedTransportRequestId = linkedTransportRequestId; }

    public Long getLinkedCropOrderId() { return linkedCropOrderId; }
    public void setLinkedCropOrderId(Long linkedCropOrderId) { this.linkedCropOrderId = linkedCropOrderId; }

    public Long getLinkedBookingId() { return linkedBookingId; }
    public void setLinkedBookingId(Long linkedBookingId) { this.linkedBookingId = linkedBookingId; }
}
