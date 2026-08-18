package com.mandi.booking;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mandi.common.BaseEntity;
import com.mandi.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "service_ratings", indexes = {
        @Index(name = "idx_rating_booking", columnList = "booking_id"),
        @Index(name = "idx_rating_target", columnList = "target_user_id"),
        @Index(name = "idx_rating_author", columnList = "author_user_id")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ServiceRating extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_user_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id", nullable = false)
    private User target;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String feedback;

    @Column(length = 200)
    private String tags; // "ON_TIME,EXCELLENT_EQUIPMENT,FAIR_PRICE"

    public ServiceRating() {}

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public User getTarget() { return target; }
    public void setTarget(User target) { this.target = target; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
