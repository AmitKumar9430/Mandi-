package com.mandi.matching;

import com.mandi.problem.Problem;
import com.mandi.problem.ProblemCategory;
import com.mandi.solution.SolutionGraph;
import com.mandi.solution.SolutionStep;
import com.mandi.solution.SolutionStepStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoDeadEndFallbackService {

    public static class FallbackSolutionResult {
        private String tier; // DIRECT_MATCH, COMMUNITY_RESOURCE, VOLUNTEER_SEVA, NGO_ASSISTANCE, MITRA_ESCALATION
        private String explanation;
        private List<SolutionStep> proposedSteps;

        public FallbackSolutionResult(String tier, String explanation, List<SolutionStep> proposedSteps) {
            this.tier = tier;
            this.explanation = explanation;
            this.proposedSteps = proposedSteps;
        }

        public String getTier() { return tier; }
        public String getExplanation() { return explanation; }
        public List<SolutionStep> getProposedSteps() { return proposedSteps; }
    }

    public FallbackSolutionResult generateFallbackSolution(Problem problem, boolean hasDirectMatches) {
        if (hasDirectMatches) {
            return new FallbackSolutionResult(
                    "DIRECT_MATCH",
                    "Direct verified providers & resources found in your district.",
                    createStandardSteps(problem)
            );
        }

        // Tier 2: Community Resource Pool Fallback
        if (problem.getCategory() == ProblemCategory.AGRICULTURE) {
            SolutionStep step1 = new SolutionStep(1, "Broadcast to Kisan Seva Network", "Notify nearby farmers and village cooperative about produce availability", "Community Agri Network");
            SolutionStep step2 = new SolutionStep(2, "Gram Panchayat Temporary Storage", "Reserve village grain holding center to prevent crop damage", "Storage");
            SolutionStep step3 = new SolutionStep(3, "MANDI Mitra Buyer Outreach", "Mitra coordinates with regional mandi traders", "MANDI Mitra");
            step1.setStatus(SolutionStepStatus.READY);

            return new FallbackSolutionResult(
                    "COMMUNITY_RESOURCE",
                    "No single direct buyer was active right away. Activated Kisan Seva network + Village holding storage fallback.",
                    List.of(step1, step2, step3)
            );
        }

        // Tier 3: Volunteer Seva Fallback for Healthcare & Education
        if (problem.getCategory() == ProblemCategory.HEALTHCARE || problem.getCategory() == ProblemCategory.EMERGENCY || problem.getCategory() == ProblemCategory.EDUCATION) {
            SolutionStep step1 = new SolutionStep(1, "Volunteer Seva Responder Dispatch", "Alert nearest registered volunteer for on-ground assistance", "Volunteer");
            SolutionStep step2 = new SolutionStep(2, "PHC / Community Centre Transport", "Volunteer arranges shared local transport to health center", "Transport");
            SolutionStep step3 = new SolutionStep(3, "Follow-up & Welfare Check", "Confirm patient care or student material delivery", "MANDI Seva Desk");
            step1.setStatus(SolutionStepStatus.READY);

            return new FallbackSolutionResult(
                    "VOLUNTEER_SEVA",
                    "Activated MANDI Seva volunteer dispatch for immediate on-ground coordination.",
                    List.of(step1, step2, step3)
            );
        }

        // Tier 4: NGO & Government Department Routing for Civic & Infrastructure
        if (problem.getCategory() == ProblemCategory.WATER_SANITATION || problem.getCategory() == ProblemCategory.ELECTRICITY || problem.getCategory() == ProblemCategory.INFRASTRUCTURE) {
            SolutionStep step1 = new SolutionStep(1, "Civic Escalation Ticket Generation", "Formal grievance lodged with Block Development / Jal Nigam officer", "Gov Official");
            SolutionStep step2 = new SolutionStep(2, "Local Youth Seva Inspection", "Community volunteer visits site to verify defect with geotagged photo", "Volunteer");
            SolutionStep step3 = new SolutionStep(3, "Department SLA Monitoring", "Track resolution timeline with 48-hour escalation window", "MANDI Portal");
            step1.setStatus(SolutionStepStatus.READY);

            return new FallbackSolutionResult(
                    "NGO_GOV_ROUTING",
                    "Lodge formal civic ticket and assigned community monitor for SLA tracking.",
                    List.of(step1, step2, step3)
            );
        }

        // Tier 5: MANDI Mitra Personalized Escalation
        SolutionStep step1 = new SolutionStep(1, "MANDI Mitra Case Assignment", "Dedicated village field facilitator assigned to assist citizen in person", "MANDI Mitra");
        SolutionStep step2 = new SolutionStep(2, "Custom Resource Discovery", "Mitra conducts physical inquiry with local panchayat and self-help groups", "Community Bank");
        SolutionStep step3 = new SolutionStep(3, "Resolution Verification", "Verify physical resolution on ground", "Citizen Confirmation");
        step1.setStatus(SolutionStepStatus.READY);

        return new FallbackSolutionResult(
                "MITRA_ESCALATION",
                "Assigned dedicated MANDI Mitra to personally investigate and facilitate resolution.",
                List.of(step1, step2, step3)
        );
    }

    private List<SolutionStep> createStandardSteps(Problem problem) {
        SolutionStep step1 = new SolutionStep(1, "Resource Matching & Contact", "Connect with highest-scored provider", "Primary Resource");
        SolutionStep step2 = new SolutionStep(2, "Service Coordination & Delivery", "Execute requested assistance or produce transfer", "Service Provider");
        SolutionStep step3 = new SolutionStep(3, "Completion & Citizen Confirmation", "Citizen confirms resolution and rates assistance", "Citizen");
        step1.setStatus(SolutionStepStatus.READY);
        return List.of(step1, step2, step3);
    }
}
