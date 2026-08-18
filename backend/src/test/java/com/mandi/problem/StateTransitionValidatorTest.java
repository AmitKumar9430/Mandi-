package com.mandi.problem;

import com.mandi.exception.InvalidStateTransitionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StateTransitionValidatorTest {

    private StateTransitionValidator validator;

    @BeforeEach
    void setUp() {
        validator = new StateTransitionValidator();
    }

    @Test
    @DisplayName("Valid transition from SUBMITTED to MATCHING should succeed")
    void testValidSubmittedToMatching() {
        assertDoesNotThrow(() -> validator.validateTransition(ProblemStatus.SUBMITTED, ProblemStatus.MATCHING));
    }

    @Test
    @DisplayName("Valid transition from SOLUTION_FOUND to ASSIGNED should succeed")
    void testValidSolutionFoundToAssigned() {
        assertDoesNotThrow(() -> validator.validateTransition(ProblemStatus.SOLUTION_FOUND, ProblemStatus.ASSIGNED));
    }

    @Test
    @DisplayName("Valid transition from IN_PROGRESS to RESOLVED should succeed")
    void testValidInProgressToResolved() {
        assertDoesNotThrow(() -> validator.validateTransition(ProblemStatus.IN_PROGRESS, ProblemStatus.RESOLVED));
    }

    @Test
    @DisplayName("Invalid backwards transition from RESOLVED to SUBMITTED must throw InvalidStateTransitionException")
    void testInvalidResolvedToSubmitted() {
        assertThrows(InvalidStateTransitionException.class, () ->
                validator.validateTransition(ProblemStatus.RESOLVED, ProblemStatus.SUBMITTED));
    }

    @Test
    @DisplayName("Invalid jump from DRAFT directly to RESOLVED must throw InvalidStateTransitionException")
    void testInvalidDraftToResolved() {
        assertThrows(InvalidStateTransitionException.class, () ->
                validator.validateTransition(ProblemStatus.DRAFT, ProblemStatus.RESOLVED));
    }

    @Test
    @DisplayName("Terminal state CLOSED must not transition to any state")
    void testClosedIsTerminal() {
        assertThrows(InvalidStateTransitionException.class, () ->
                validator.validateTransition(ProblemStatus.CLOSED, ProblemStatus.IN_PROGRESS));
    }
}
