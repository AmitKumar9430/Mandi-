package com.mandi.problem;

import com.mandi.exception.InvalidStateTransitionException;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class StateTransitionValidator {

    private static final Map<ProblemStatus, Set<ProblemStatus>> VALID_TRANSITIONS = new EnumMap<>(ProblemStatus.class);

    static {
        // DRAFT -> SUBMITTED, NEW, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.DRAFT, EnumSet.of(ProblemStatus.SUBMITTED, ProblemStatus.NEW, ProblemStatus.CANCELLED));

        // NEW / SUBMITTED -> ASSIGNED, UNDER_REVIEW, VERIFIED, MATCHING, SOLUTION_FOUND, CANCELLED, REJECTED
        Set<ProblemStatus> initialTransitions = EnumSet.of(
                ProblemStatus.ASSIGNED, ProblemStatus.UNDER_REVIEW, ProblemStatus.VERIFIED,
                ProblemStatus.MATCHING, ProblemStatus.SOLUTION_FOUND, ProblemStatus.IN_PROGRESS,
                ProblemStatus.CANCELLED, ProblemStatus.REJECTED
        );
        VALID_TRANSITIONS.put(ProblemStatus.NEW, initialTransitions);
        VALID_TRANSITIONS.put(ProblemStatus.SUBMITTED, initialTransitions);

        // UNDER_REVIEW -> VERIFIED, MATCHING, ASSIGNED, REJECTED, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.UNDER_REVIEW, EnumSet.of(
                ProblemStatus.VERIFIED, ProblemStatus.MATCHING, ProblemStatus.ASSIGNED, ProblemStatus.REJECTED, ProblemStatus.CANCELLED
        ));

        // VERIFIED -> MATCHING, SOLUTION_FOUND, ASSIGNED, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.VERIFIED, EnumSet.of(
                ProblemStatus.MATCHING, ProblemStatus.SOLUTION_FOUND, ProblemStatus.ASSIGNED, ProblemStatus.CANCELLED
        ));

        // MATCHING -> SOLUTION_FOUND, ASSIGNED, WAITING, ESCALATED, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.MATCHING, EnumSet.of(
                ProblemStatus.SOLUTION_FOUND, ProblemStatus.ASSIGNED, ProblemStatus.WAITING, ProblemStatus.ESCALATED, ProblemStatus.CANCELLED
        ));

        // SOLUTION_FOUND -> AWAITING_USER, ASSIGNED, IN_PROGRESS, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.SOLUTION_FOUND, EnumSet.of(
                ProblemStatus.AWAITING_USER, ProblemStatus.ASSIGNED, ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, ProblemStatus.CANCELLED
        ));

        // AWAITING_USER -> ASSIGNED, ACCEPTED, IN_PROGRESS, MATCHING, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.AWAITING_USER, EnumSet.of(
                ProblemStatus.ASSIGNED, ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, ProblemStatus.MATCHING, ProblemStatus.CANCELLED
        ));

        // ASSIGNED -> ACCEPTED, IN_PROGRESS, WAITING, ESCALATED, OVERDUE, MATCHING, CANCELLED, REJECTED
        VALID_TRANSITIONS.put(ProblemStatus.ASSIGNED, EnumSet.of(
                ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, ProblemStatus.WAITING, ProblemStatus.ESCALATED,
                ProblemStatus.OVERDUE, ProblemStatus.MATCHING, ProblemStatus.CANCELLED, ProblemStatus.REJECTED
        ));

        // ACCEPTED -> IN_PROGRESS, WAITING, ESCALATED, OVERDUE, CANCELLED, REJECTED
        VALID_TRANSITIONS.put(ProblemStatus.ACCEPTED, EnumSet.of(
                ProblemStatus.IN_PROGRESS, ProblemStatus.WAITING, ProblemStatus.ESCALATED, ProblemStatus.OVERDUE,
                ProblemStatus.CANCELLED, ProblemStatus.REJECTED
        ));

        // IN_PROGRESS -> RESOLVED, VERIFICATION_PENDING, WAITING, ESCALATED, OVERDUE, MATCHING, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.IN_PROGRESS, EnumSet.of(
                ProblemStatus.RESOLVED, ProblemStatus.VERIFICATION_PENDING, ProblemStatus.WAITING, ProblemStatus.ESCALATED,
                ProblemStatus.OVERDUE, ProblemStatus.MATCHING, ProblemStatus.CANCELLED
        ));

        // WAITING -> IN_PROGRESS, MATCHING, ESCALATED, OVERDUE, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.WAITING, EnumSet.of(
                ProblemStatus.IN_PROGRESS, ProblemStatus.MATCHING, ProblemStatus.ESCALATED, ProblemStatus.OVERDUE, ProblemStatus.CANCELLED
        ));

        // ESCALATED -> ASSIGNED, ACCEPTED, IN_PROGRESS, RESOLVED, VERIFICATION_PENDING, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.ESCALATED, EnumSet.of(
                ProblemStatus.ASSIGNED, ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, ProblemStatus.RESOLVED,
                ProblemStatus.VERIFICATION_PENDING, ProblemStatus.CANCELLED
        ));

        // OVERDUE -> ASSIGNED, ACCEPTED, IN_PROGRESS, RESOLVED, ESCALATED, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.OVERDUE, EnumSet.of(
                ProblemStatus.ASSIGNED, ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, ProblemStatus.RESOLVED,
                ProblemStatus.ESCALATED, ProblemStatus.CANCELLED
        ));

        // RESOLVED -> VERIFICATION_PENDING, COMPLETED, CLOSED, REOPENED, IN_PROGRESS
        VALID_TRANSITIONS.put(ProblemStatus.RESOLVED, EnumSet.of(
                ProblemStatus.VERIFICATION_PENDING, ProblemStatus.COMPLETED, ProblemStatus.CLOSED, ProblemStatus.REOPENED, ProblemStatus.IN_PROGRESS
        ));

        // VERIFICATION_PENDING -> COMPLETED, CLOSED, REOPENED, IN_PROGRESS
        VALID_TRANSITIONS.put(ProblemStatus.VERIFICATION_PENDING, EnumSet.of(
                ProblemStatus.COMPLETED, ProblemStatus.CLOSED, ProblemStatus.REOPENED, ProblemStatus.IN_PROGRESS
        ));

        // REOPENED -> ASSIGNED, ACCEPTED, IN_PROGRESS, ESCALATED, CANCELLED
        VALID_TRANSITIONS.put(ProblemStatus.REOPENED, EnumSet.of(
                ProblemStatus.ASSIGNED, ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, ProblemStatus.ESCALATED, ProblemStatus.CANCELLED
        ));

        // COMPLETED -> CLOSED, REOPENED
        VALID_TRANSITIONS.put(ProblemStatus.COMPLETED, EnumSet.of(
                ProblemStatus.CLOSED, ProblemStatus.REOPENED
        ));

        // CLOSED -> REOPENED (Admin override only)
        VALID_TRANSITIONS.put(ProblemStatus.CLOSED, EnumSet.of(ProblemStatus.REOPENED));

        // CANCELLED -> Terminal state
        VALID_TRANSITIONS.put(ProblemStatus.CANCELLED, Collections.emptySet());

        // REJECTED -> Terminal state
        VALID_TRANSITIONS.put(ProblemStatus.REJECTED, Collections.emptySet());
    }

    public void validateTransition(ProblemStatus currentStatus, ProblemStatus nextStatus) {
        if (currentStatus == nextStatus) {
            return; // No-op
        }

        Set<ProblemStatus> allowedNextStates = VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
        if (!allowedNextStates.contains(nextStatus)) {
            throw new InvalidStateTransitionException(
                    String.format("Cannot transition problem status from %s to %s. Allowed transitions: %s",
                            currentStatus, nextStatus, allowedNextStates)
            );
        }
    }
}
