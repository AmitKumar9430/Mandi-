package com.mandi.problem;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ClassifierEngine {

    public static class ClassificationResult {
        private ProblemCategory category;
        private ProblemUrgency urgency;
        private String title;
        private List<String> extractedTags;
        private List<String> requiredResources;
        private String solutionPathSummary;

        public ClassificationResult() {}

        public ClassificationResult(ProblemCategory category, ProblemUrgency urgency, String title,
                                    List<String> extractedTags, List<String> requiredResources, String solutionPathSummary) {
            this.category = category;
            this.urgency = urgency;
            this.title = title;
            this.extractedTags = extractedTags;
            this.requiredResources = requiredResources;
            this.solutionPathSummary = solutionPathSummary;
        }

        public ProblemCategory getCategory() { return category; }
        public ProblemUrgency getUrgency() { return urgency; }
        public String getTitle() { return title; }
        public List<String> getExtractedTags() { return extractedTags; }
        public List<String> getRequiredResources() { return requiredResources; }
        public String getSolutionPathSummary() { return solutionPathSummary; }
    }

    public ClassificationResult classify(String text, ProblemCategory fallbackCategory) {
        if (text == null || text.isBlank()) {
            return new ClassificationResult(
                    fallbackCategory != null ? fallbackCategory : ProblemCategory.OTHER,
                    ProblemUrgency.MEDIUM,
                    "General Assistance Request",
                    List.of("general", "help"),
                    List.of("Community Facilitator"),
                    "Step 1: Contact MANDI Mitra -> Step 2: Resource Assignment"
            );
        }

        String lower = text.toLowerCase();
        ProblemCategory detectedCategory = fallbackCategory;
        ProblemUrgency detectedUrgency = ProblemUrgency.MEDIUM;
        List<String> tags = new ArrayList<>();
        List<String> resources = new ArrayList<>();
        String solutionPath = "MANDI Mitra Coordination -> Resource Assignment -> Verification";

        // Emergency & Healthcare
        if (lower.contains("khoon") || lower.contains("blood") || lower.contains("oxygen") || lower.contains("behosh") ||
                lower.contains("heart") || lower.contains("accident") || lower.contains("emergency") || lower.contains("critical")) {
            detectedCategory = ProblemCategory.EMERGENCY;
            detectedUrgency = ProblemUrgency.CRITICAL;
            tags.addAll(List.of("critical", "emergency", "immediate_aid"));
            resources.addAll(List.of("Ambulance / Emergency Vehicle", "Hospital Admission Desk", "Nearby Volunteer"));
            solutionPath = "Volunteer Dispatch -> Emergency Transport -> Hospital Intake -> Coordination";
        }
        else if (lower.contains("dawa") || lower.contains("medicine") || lower.contains("hospital") || lower.contains("doctor") ||
                lower.contains("bimari") || lower.contains("illness") || lower.contains("clinic") || lower.contains("ambulance") ||
                lower.contains("treatment") || lower.contains("elderly") || lower.contains("bujurg")) {
            detectedCategory = ProblemCategory.HEALTHCARE;
            detectedUrgency = lower.contains("bujurg") || lower.contains("elderly") || lower.contains("severe") ? ProblemUrgency.HIGH : ProblemUrgency.MEDIUM;
            tags.addAll(List.of("healthcare", "medical_aid", "doctor_consultation"));
            resources.addAll(List.of("Volunteer Escort", "Local Transport", "PHC / Hospital Desk", "Medicine Subsidy"));
            solutionPath = "Volunteer Match -> Transport Aid -> Clinic Visit -> Medication Aid";
        }
        // Agriculture
        else if (lower.contains("wheat") || lower.contains("gehu") || lower.contains("dhan") || lower.contains("paddy") ||
                lower.contains("kisan") || lower.contains("farmer") || lower.contains("fasal") || lower.contains("crop") ||
                lower.contains("tractor") || lower.contains("buyer") || lower.contains("mandi") || lower.contains("quintal") ||
                lower.contains("khad") || lower.contains("fertilizer") || lower.contains("beej") || lower.contains("seeds") ||
                lower.contains("storage") || lower.contains("godown") || lower.contains("harvester")) {
            detectedCategory = ProblemCategory.AGRICULTURE;
            detectedUrgency = lower.contains("kharab") || lower.contains("spoil") || lower.contains("rain") ? ProblemUrgency.HIGH : ProblemUrgency.MEDIUM;
            tags.addAll(List.of("agriculture", "kisan_seva", "produce_market"));
            resources.addAll(List.of("Verified Crop Buyer", "Local Transport / Tractor", "Temporary Storage", "Agri Officer Support"));
            solutionPath = "Produce Listing -> Verified Buyer Match -> Transport Arrangement -> Storage & Settlement";
        }
        // Water & Sanitation
        else if (lower.contains("paani") || lower.contains("water") || lower.contains("handpump") || lower.contains("borewell") ||
                lower.contains("nal") || lower.contains("tap") || lower.contains("drain") || lower.contains("naali") ||
                lower.contains("sewer") || lower.contains("kachra") || lower.contains("garbage") || lower.contains("safai")) {
            detectedCategory = ProblemCategory.WATER_SANITATION;
            detectedUrgency = lower.contains("3 hafte") || lower.contains("weeks") || lower.contains("peene") ? ProblemUrgency.HIGH : ProblemUrgency.MEDIUM;
            tags.addAll(List.of("water_supply", "sanitation", "civic_repair"));
            resources.addAll(List.of("Panchayat Pump Mechanic", "Water Tanker Emergency", "Jal Nigam Escalation"));
            solutionPath = "Civic Ticket Verification -> Local Mechanic Dispatch -> Panchayat Resource Pool -> Resolution Confirmation";
        }
        // Electricity & Infrastructure
        else if (lower.contains("bijli") || lower.contains("light") || lower.contains("power") || lower.contains("transformer") ||
                lower.contains("wire") || lower.contains("pole") || lower.contains("current") || lower.contains("blackout")) {
            detectedCategory = ProblemCategory.ELECTRICITY;
            detectedUrgency = lower.contains("transformer") || lower.contains("wire tut") ? ProblemUrgency.HIGH : ProblemUrgency.MEDIUM;
            tags.addAll(List.of("electricity", "power_grid", "lineman_support"));
            resources.addAll(List.of("Electricity Board Lineman", "Local Certified Electrician", "Community Generator"));
            solutionPath = "Electricity Grievance Dispatch -> Department SLA Tracking -> Lineman Repair -> Power Restoration";
        }
        else if (lower.contains("sadak") || lower.contains("road") || lower.contains("pothole") || lower.contains("gaddha") ||
                lower.contains("bridge") || lower.contains("pul") || lower.contains("street light") || lower.contains("pole")) {
            detectedCategory = ProblemCategory.INFRASTRUCTURE;
            tags.addAll(List.of("infrastructure", "public_works", "road_safety"));
            resources.addAll(List.of("PWD / Gram Panchayat Desk", "Community Construction Pool"));
            solutionPath = "Geotagged Civic Audit -> Panchayat Works Allocation -> Contractor Repair -> Public Confirmation";
        }
        // Jobs & Livelihood
        else if (lower.contains("naukri") || lower.contains("job") || lower.contains("rozgar") || lower.contains("kaam") ||
                lower.contains("worker") || lower.contains("mazdoor") || lower.contains("mistri") || lower.contains("plumber") ||
                lower.contains("driver") || lower.contains("carpenter") || lower.contains("wage") || lower.contains("salary")) {
            detectedCategory = ProblemCategory.EMPLOYMENT;
            tags.addAll(List.of("livelihood", "job_connect", "skill_match"));
            resources.addAll(List.of("Local Employer / Contractor", "Skill Exchange Match", "MGNREGA / Rural Work Desk"));
            solutionPath = "Skill Verification -> Nearby Employer Search -> Wage Agreement -> Work Allocation";
        }
        // Education & Schemes
        else if (lower.contains("padhai") || lower.contains("school") || lower.contains("books") || lower.contains("kitab") ||
                lower.contains("student") || lower.contains("tutor") || lower.contains("fee") || lower.contains("scholarship")) {
            detectedCategory = ProblemCategory.EDUCATION;
            tags.addAll(List.of("education", "student_support", "book_bank"));
            resources.addAll(List.of("Community Book Bank", "Volunteer Student Tutor", "Scholarship Scheme Navigator"));
            solutionPath = "Student Needs Assessment -> Book Bank Allocation -> Volunteer Tutor Match -> Scheme Enrollment";
        }
        // Government Scheme Navigation
        else if (lower.contains("yojana") || lower.contains("scheme") || lower.contains("pension") || lower.contains("ration") ||
                lower.contains("aadhaar") || lower.contains("form") || lower.contains("dakhila") || lower.contains("pm kisan")) {
            detectedCategory = ProblemCategory.SOCIAL_WELFARE;
            tags.addAll(List.of("gov_schemes", "welfare_benefits", "csc_mitra"));
            resources.addAll(List.of("MANDI Mitra Help Desk", "CSC Center Facilitator", "Verified Scheme Navigator"));
            solutionPath = "Eligibility Assessment -> Document Checklist -> CSC / Mitra Application -> Verification";
        }

        if (detectedCategory == null) {
            detectedCategory = ProblemCategory.OTHER;
            tags.addAll(List.of("community_request", "mandi_resolution"));
            resources.addAll(List.of("MANDI Mitra Facilitator", "Local Volunteer"));
            solutionPath = "Mitra Verification -> Community Resource Search -> Custom Resolution Plan";
        }

        // Generate clean title
        String summaryTitle = text.length() > 60 ? text.substring(0, 57).trim() + "..." : text;
        if (summaryTitle.length() < 5) {
            summaryTitle = "Assistance Request: " + detectedCategory.name();
        }

        return new ClassificationResult(detectedCategory, detectedUrgency, summaryTitle, tags, resources, solutionPath);
    }
}
