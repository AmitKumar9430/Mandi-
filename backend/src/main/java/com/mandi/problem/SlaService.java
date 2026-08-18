package com.mandi.problem;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class SlaService {

    public static final Duration CRITICAL_SLA = Duration.ofHours(6);
    public static final Duration HIGH_SLA = Duration.ofHours(24);
    public static final Duration MEDIUM_SLA = Duration.ofHours(72);  // 3 days
    public static final Duration LOW_SLA = Duration.ofHours(120);    // 5 days

    public Duration getSlaDuration(ProblemUrgency urgency) {
        if (urgency == null) return MEDIUM_SLA;
        return switch (urgency) {
            case CRITICAL -> CRITICAL_SLA;
            case HIGH -> HIGH_SLA;
            case MEDIUM -> MEDIUM_SLA;
            case LOW -> LOW_SLA;
        };
    }

    public Instant calculateDeadline(Instant startTime, ProblemUrgency urgency) {
        if (startTime == null) startTime = Instant.now();
        return startTime.plus(getSlaDuration(urgency));
    }

    public String computeSlaStatus(Instant createdAt, Instant deadline, Instant resolvedAt, ProblemStatus status) {
        Instant now = Instant.now();

        // If ticket is already completed or closed
        if (resolvedAt != null || status == ProblemStatus.RESOLVED || status == ProblemStatus.COMPLETED || status == ProblemStatus.CLOSED) {
            Instant effectiveResolution = resolvedAt != null ? resolvedAt : now;
            if (deadline != null && effectiveResolution.isAfter(deadline)) {
                return "COMPLETED_AFTER_SLA";
            }
            return "COMPLETED_WITHIN_SLA";
        }

        // Active ticket checks
        if (deadline != null) {
            if (now.isAfter(deadline)) {
                return "OVERDUE";
            }
            // If less than 20% SLA time remains, mark as AT_RISK
            if (createdAt != null) {
                long totalSeconds = Duration.between(createdAt, deadline).getSeconds();
                long remainingSeconds = Duration.between(now, deadline).getSeconds();
                if (totalSeconds > 0 && ((double) remainingSeconds / totalSeconds) < 0.20) {
                    return "AT_RISK";
                }
            }
        }

        return "ON_TIME";
    }
}
