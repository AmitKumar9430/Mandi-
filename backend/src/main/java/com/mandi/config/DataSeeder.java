package com.mandi.config;

import com.mandi.agriculture.Crop;
import com.mandi.agriculture.CropRepository;
import com.mandi.job.JobPosting;
import com.mandi.job.JobPostingRepository;
import com.mandi.organization.*;
import com.mandi.problem.*;
import com.mandi.resource.Resource;
import com.mandi.resource.ResourceCategory;
import com.mandi.resource.ResourceRepository;
import com.mandi.scheme.GovernmentScheme;
import com.mandi.scheme.GovernmentSchemeRepository;
import com.mandi.solution.SolutionGraph;
import com.mandi.solution.SolutionGraphRepository;
import com.mandi.solution.SolutionStep;
import com.mandi.solution.SolutionStepStatus;
import com.mandi.user.Role;
import com.mandi.user.User;
import com.mandi.user.UserProfile;
import com.mandi.user.UserProfileRepository;
import com.mandi.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResourceRepository resourceRepository;
    private final ProblemRepository problemRepository;
    private final ProblemPassportRepository passportRepository;
    private final ProblemEventRepository eventRepository;
    private final SolutionGraphRepository solutionGraphRepository;
    private final CropRepository cropRepository;
    private final JobPostingRepository jobPostingRepository;
    private final GovernmentSchemeRepository schemeRepository;
    private final OrganizationRepository organizationRepository;
    private final com.mandi.transport.VehicleRepository vehicleRepository;
    private final com.mandi.mitra.VillageMitraProfileRepository mitraRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(
            UserRepository userRepository,
            UserProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            ResourceRepository resourceRepository,
            ProblemRepository problemRepository,
            ProblemPassportRepository passportRepository,
            ProblemEventRepository eventRepository,
            SolutionGraphRepository solutionGraphRepository,
            CropRepository cropRepository,
            JobPostingRepository jobPostingRepository,
            GovernmentSchemeRepository schemeRepository,
            OrganizationRepository organizationRepository,
            com.mandi.transport.VehicleRepository vehicleRepository,
            com.mandi.mitra.VillageMitraProfileRepository mitraRepository,
            JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.resourceRepository = resourceRepository;
        this.problemRepository = problemRepository;
        this.passportRepository = passportRepository;
        this.eventRepository = eventRepository;
        this.solutionGraphRepository = solutionGraphRepository;
        this.cropRepository = cropRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.schemeRepository = schemeRepository;
        this.organizationRepository = organizationRepository;
        this.vehicleRepository = vehicleRepository;
        this.mitraRepository = mitraRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Upgrade any existing schema columns to LONGTEXT / VARCHAR(50) for large data
        try {
            if (jdbcTemplate != null) {
                jdbcTemplate.execute("ALTER TABLE user_roles MODIFY role VARCHAR(50)");
                jdbcTemplate.execute("ALTER TABLE problems MODIFY photo_url LONGTEXT");
                jdbcTemplate.execute("ALTER TABLE problems MODIFY audio_recording_url LONGTEXT");
                jdbcTemplate.execute("ALTER TABLE civic_reports MODIFY photo_url LONGTEXT");
                jdbcTemplate.execute("ALTER TABLE civic_reports MODIFY resolution_proof_url LONGTEXT");
                log.info("Verified MySQL LONGTEXT and VARCHAR(50) column types.");
            }
        } catch (Exception e) {
            log.info("Schema columns check/update: " + e.getMessage());
        }

        // 0. Ensure Super Admin (amitkr9523da@gmail.com) always exists
        try {
            String superAdminEmail = "amitkr9523da@gmail.com";
            Optional<User> superAdminOpt = userRepository.findByEmail(superAdminEmail);
            if (superAdminOpt.isEmpty()) {
                String encodedAdminPass = passwordEncoder.encode("Admin@123");
                User superAdmin = new User("9876543219", superAdminEmail, encodedAdminPass, "Amit Kumar (Super Admin)");
                superAdmin.setRoles(new java.util.HashSet<>(Set.of(Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN, Role.ROLE_CITIZEN)));
                superAdmin.setActive(true);
                superAdmin.setVerified(true);
                User saved = userRepository.save(superAdmin);

                UserProfile profile = new UserProfile(saved);
                profile.setVillageOrTown("Lucknow Central");
                profile.setDistrict("Lucknow");
                profile.setState("Uttar Pradesh");
                profile.setPreferredLanguage("HI");
                profile.setTrustScore(100);
                profileRepository.save(profile);
                log.info("👑 Super Admin seeded: {}", superAdminEmail);
            } else {
                User existing = superAdminOpt.get();
                if (existing.getRoles() == null) {
                    existing.setRoles(new java.util.HashSet<>());
                }
                existing.getRoles().add(Role.ROLE_ADMIN);
                existing.getRoles().add(Role.ROLE_SUPER_ADMIN);
                existing.setPassword(passwordEncoder.encode("Admin@123"));
                existing.setActive(true);
                existing.setVerified(true);
                userRepository.save(existing);
                log.info("👑 Super Admin roles and password updated for: {}", superAdminEmail);
            }
        } catch (Exception e) {
            log.error("Failed to seed Super Admin: {}", e.getMessage());
        }

        // 0.1 Ensure user justabhiofficial724@gmail.com always exists
        try {
            String userEmail = "justabhiofficial724@gmail.com";
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                String encPass = passwordEncoder.encode("Password@123");
                User mainUser = new User("9234042397", userEmail, encPass, "Abhishek (MANDI User)");
                mainUser.setRoles(new java.util.HashSet<>(Set.of(Role.ROLE_ADMIN, Role.ROLE_SUPER_ADMIN, Role.ROLE_FARMER, Role.ROLE_CITIZEN)));
                mainUser.setActive(true);
                mainUser.setVerified(true);
                User saved = userRepository.save(mainUser);

                UserProfile profile = new UserProfile(saved);
                profile.setVillageOrTown("Gharuan");
                profile.setDistrict("Mohali");
                profile.setState("Punjab");
                profile.setPreferredLanguage("HI");
                profile.setTrustScore(100);
                profileRepository.save(profile);
                log.info("👤 Primary User seeded: {}", userEmail);
            }
        } catch (Exception e) {
            log.error("Failed to seed primary user: {}", e.getMessage());
        }

        // Ensure Organizations are always seeded
        seedOrganizations();

        // Ensure all historical records have correct normalized district & state attribution
        repairLocationDistrictsAndStates();

        if (userRepository.count() > 2 && problemRepository.count() > 0) {
            log.info("MANDI database already has data. Ensuring sample tickets have valid codes.");
            fixNullTicketCodes();
            return;
        }

        log.info("Starting MANDI seed data initialization...");

        // 1. Create Core Users
        String encodedPassword = passwordEncoder.encode("Password@123");

        User citizen = createUser("9876543210", "citizen@mandi.org", "Rameshwar Kumar", encodedPassword, Set.of(Role.ROLE_CITIZEN), "Bakshi Ka Talab", "Lucknow", 26.9740, 80.9320);
        User farmer = createUser("9876543211", "farmer@mandi.org", "Balram Singh", encodedPassword, Set.of(Role.ROLE_FARMER, Role.ROLE_CITIZEN), "Malihabad", "Lucknow", 26.9200, 80.7100);
        User worker = createUser("9876543212", "worker@mandi.org", "Chhotu Lal Mistri", encodedPassword, Set.of(Role.ROLE_WORKER, Role.ROLE_CITIZEN), "Chinhat", "Lucknow", 26.8850, 81.0120);
        User volunteer = createUser("9876543213", "volunteer@mandi.org", "Pooja Sharma", encodedPassword, Set.of(Role.ROLE_VOLUNTEER, Role.ROLE_CITIZEN), "Aliganj", "Lucknow", 26.8870, 80.9420);
        User ngo = createUser("9876543214", "ngo@mandi.org", "Gramin Vikas Sansthan", encodedPassword, Set.of(Role.ROLE_NGO, Role.ROLE_CITIZEN), "Mohanlalganj", "Lucknow", 26.6700, 80.9800);
        User provider = createUser("9876543215", "provider@mandi.org", "Awadh Kisan Agri Services", encodedPassword, Set.of(Role.ROLE_SERVICE_PROVIDER, Role.ROLE_CITIZEN), "Kakori", "Lucknow", 26.8700, 80.7900);
        User mitra = createUser("9876543216", "mitra@mandi.org", "Suresh MANDI Mitra", encodedPassword, Set.of(Role.ROLE_MANDI_MITRA, Role.ROLE_VOLUNTEER, Role.ROLE_CITIZEN), "Gosainganj", "Lucknow", 26.7700, 81.1200);
        User admin = createUser("9876543217", "admin@mandi.org", "MANDI System Admin", encodedPassword, Set.of(Role.ROLE_ADMIN, Role.ROLE_CITIZEN), "Lucknow Central", "Lucknow", 26.8467, 80.9462);

        // 2. Create Community Resources
        createResource(provider, "Mahindra 575 DI Tractor with Hydraulic Trolley", ResourceCategory.TRACTOR_EQUIPMENT, "Available for harvesting, produce transport and field ploughing.", "Kakori", "Lucknow", 26.8700, 80.7900, 450.0, "per hour", "9876543215", 4.9, 42);
        createResource(volunteer, "Emergency Patient Transport Vehicle (Omni)", ResourceCategory.TRANSPORT_VEHICLE, "Free volunteer transport for elderly, pregnant women, and hospital visits.", "Aliganj", "Lucknow", 26.8870, 80.9420, 0.0, "free", "9876543213", 5.0, 28);
        createResource(ngo, "Village Grain Storage & Drying Yard (1000 Quintal)", ResourceCategory.STORAGE_FACILITY, "Secure dry storage facility for harvested grain with moisture protection.", "Mohanlalganj", "Lucknow", 26.6700, 80.9800, 25.0, "per quintal/month", "9876543214", 4.8, 65);
        createResource(ngo, "Community Medical Equipment Pool (Wheelchairs, Oxygen, BP kit)", ResourceCategory.MEDICAL_EQUIPMENT, "Available for temporary home patient recovery free of cost.", "Mohanlalganj", "Lucknow", 26.6700, 80.9800, 0.0, "free", "9876543214", 5.0, 19);
        createResource(mitra, "Digital Kendra & Govt Scheme Application Desk", ResourceCategory.VOLUNTEER_TIME, "Assistance with online form filling, Aadhaar DBT linkage, and Kisan KYC.", "Gosainganj", "Lucknow", 26.7700, 81.1200, 0.0, "free", "9876543216", 5.0, 93);
        createResource(worker, "Certified Borewell & Handpump Repair Toolkit", ResourceCategory.TOOL_KIT, "Heavy-duty pipes, wrench kit, and pump valve spares for instant village repairs.", "Chinhat", "Lucknow", 26.8850, 81.0120, 200.0, "per repair", "9876543212", 4.7, 31);

        // 3. Create Sample Complaints across full workflow lifecycle
        Organization uppcl = organizationRepository.findByCode("UPPCL_LKO").orElse(null);
        Organization pwd = organizationRepository.findByCode("PWD_LKO").orElse(null);
        Organization jalNigam = organizationRepository.findByCode("JAL_NIGAM_LKO").orElse(null);

        seedSampleComplaint1(citizen, uppcl);
        seedSampleComplaint2(farmer, pwd);
        seedSampleComplaint3(citizen, jalNigam);

        // 4. Create Crops, Jobs, and Schemes
        createCrop(farmer, "Dasheri Mango (Export Quality)", "Dasheri GI", 85.0, 4200.0, LocalDate.now().minusDays(20), "Malihabad", "Lucknow", 26.9200, 80.7100);
        createCrop(farmer, "Sharbati Wheat (Grain 306)", "Sharbati", 140.0, 2650.0, LocalDate.now().minusDays(10), "Bakshi Ka Talab", "Lucknow", 26.9740, 80.9320);
        createCrop(farmer, "Mustard Seed (Pusa Mustard 31)", "Pusa 31", 60.0, 5400.0, LocalDate.now().minusDays(5), "Mohanlalganj", "Lucknow", 26.6700, 80.9800);

        createJob(farmer, "Tractor Driver for 15 Acres Harvest", "TRACTOR_OPERATOR", "Need experienced tractor driver for 4 days wheat trolley transport.", 700.0, "per day", 4, "Malihabad", "Lucknow", 26.9200, 80.7100);
        createJob(ngo, "Village Health Camp Volunteer Assistant", "COMMUNITY_HEALTH", "Support doctor registration desk and distribution of free medicines.", 500.0, "per day", 2, "Mohanlalganj", "Lucknow", 26.6700, 80.9800);

        createScheme("PM Kisan Samman Nidhi Yojana", "AGRICULTURE", "Direct income support of ₹6,000 per year to small and marginal farmer families.", "Landholding farmer families with cultivable land up to 2 hectares.", "₹6,000 annually paid in 3 installments of ₹2,000 directly into bank account.", "Aadhaar Card, Land ownership papers (Khatauni), Bank Passbook", "Online at pmkisan.gov.in or CSC Center", "https://pmkisan.gov.in", false);
        createScheme("Pradhan Mantri Gram Sadak Yojana (PMGSY)", "INFRASTRUCTURE", "Connecting unconnected rural habitations with all-weather roads.", "Rural habitations with population 500+ (plain areas) or 250+ (tribal).", "All-weather black-top road connectivity from village to market center.", "Gram Panchayat Resolution, Habitation survey", "Through Gram Panchayat & PWD Division", "https://pmgsy.nic.in", false);

        log.info("🎉 MANDI seed data initialization complete.");
    }

    private void seedOrganizations() {
        if (organizationRepository.count() >= 6) return;

        createOrg("UPPCL Rural Electricity Board", "UPPCL_LKO", OrganizationCategory.ELECTRICITY, DepartmentType.GOVERNMENT_DEPT, "Lucknow", "Uttar Pradesh", "0522-228741", "electricity.uppcl@up.gov.in", "Er. R.K. Saxena", 42, 38, 2, 4.8);
        createOrg("PWD Public Works & Road Infrastructure", "PWD_LKO", OrganizationCategory.ROADS_INFRASTRUCTURE, DepartmentType.GOVERNMENT_DEPT, "Lucknow", "Uttar Pradesh", "0522-261452", "ce.pwd@up.gov.in", "Er. S.P. Verma", 55, 49, 4, 4.6);
        createOrg("UP Jal Nigam Rural Water Supply", "JAL_NIGAM_LKO", OrganizationCategory.WATER_SANITATION, DepartmentType.GOVERNMENT_DEPT, "Lucknow", "Uttar Pradesh", "0522-273199", "jalnigam.rural@up.gov.in", "Shri Anand Mishra", 36, 32, 1, 4.7);
        createOrg("Krishi Vigyan Kendra (Sitapur & Lucknow)", "KVK_AGRI_UP", OrganizationCategory.AGRICULTURE, DepartmentType.GOVERNMENT_DEPT, "Lucknow", "Uttar Pradesh", "0522-299314", "kvk.lucknow@icar.gov.in", "Dr. V.K. Singh", 60, 56, 1, 4.9);
        createOrg("District Health Office & CMO Hospital Network", "CMO_HEALTH_LKO", OrganizationCategory.HEALTHCARE, DepartmentType.GOVERNMENT_DEPT, "Lucknow", "Uttar Pradesh", "0522-220456", "cmo.lucknow@up.gov.in", "Dr. Manoj Agarwal", 48, 44, 2, 4.9);
        createOrg("Awadh Gram Seva Sansthan (Accredited NGO)", "AWADH_SEVA_NGO", OrganizationCategory.NGO_WELFARE, DepartmentType.ACCREDITED_NGO, "Lucknow", "Uttar Pradesh", "9876543214", "contact@awadhgramseva.org", "Smt. Shanti Devi", 25, 24, 0, 5.0);

        log.info("🏢 Seeded standard public departments and accredited organizations.");
    }

    private void createOrg(String name, String code, OrganizationCategory cat, DepartmentType type, String dist, String state, String phone, String email, String head, int assigned, int resolved, int overdue, double rating) {
        if (organizationRepository.findByCode(code).isPresent()) return;
        Organization org = new Organization(name, code, cat, type, dist, state, phone, email);
        org.setHeadOfDept(head);
        org.setTotalAssigned(assigned);
        org.setTotalResolved(resolved);
        org.setTotalOverdue(overdue);
        org.setAvgRating(rating);
        org.setTotalRatings(resolved);
        org.setAvgResolutionHours(18.5);
        organizationRepository.save(org);
    }

    private void seedSampleComplaint1(User citizen, Organization org) {
        Problem p = new Problem();
        p.setUser(citizen);
        p.setTitle("Burnt 25kVA Agriculture Transformer in Bakshi Ka Talab");
        p.setRawDescription("The 25kVA transformer powering our 14 tubewells caught fire yesterday night due to a sudden voltage spike. Irrigation for 60 acres of wheat is completely halted.");
        p.setCategory(ProblemCategory.ELECTRICITY);
        p.setSubCategory("Transformer Burnt / Power Outage");
        p.setUrgency(ProblemUrgency.CRITICAL);
        p.setStatus(ProblemStatus.IN_PROGRESS);
        p.setVillageOrTown("Bakshi Ka Talab");
        p.setDistrict("Lucknow");
        p.setState("Uttar Pradesh");
        p.setPincode("226201");
        p.setAddress("Near Primary School, Village Kamlapur, BKT");
        p.setContactPhone("9876543210");
        p.setContactName("Rameshwar Kumar");
        p.setLatitude(26.9740);
        p.setLongitude(80.9320);
        p.setAssignedOrganization(org);
        p.setAssignedAt(Instant.now().minus(Duration.ofHours(5)));
        p.setAcceptedAt(Instant.now().minus(Duration.ofHours(4)));
        p.setWorkStartedAt(Instant.now().minus(Duration.ofHours(2)));
        p.setSlaDeadline(Instant.now().plus(Duration.ofHours(3)));
        p.setSlaStatus("ON_TIME");

        Problem saved = problemRepository.save(p);
        String code = String.format("MANDI-2026-%06d", saved.getId());
        ProblemPassport passport = new ProblemPassport(saved, code);
        passport.setAiAnalysisSummary("Critical power outage impacting village tubewells. UPPCL transformer replacement scheduled.");
        passportRepository.save(passport);

        ProblemEvent e1 = new ProblemEvent(saved, ProblemStatus.DRAFT, ProblemStatus.ASSIGNED, "CREATE_COMPLAINT", "Complaint logged and auto-assigned to UPPCL.", citizen.getFullName(), citizen.getId());
        ProblemEvent e2 = new ProblemEvent(saved, ProblemStatus.ASSIGNED, ProblemStatus.ACCEPTED, "ACCEPT_COMPLAINT", "UPPCL Line Engineer accepted dispatch.", "Er. R.K. Saxena", null);
        ProblemEvent e3 = new ProblemEvent(saved, ProblemStatus.ACCEPTED, ProblemStatus.IN_PROGRESS, "START_WORK", "Replacement 25kVA unit dispatched on flatbed crane truck.", "Er. R.K. Saxena", null);
        eventRepository.saveAll(List.of(e1, e2, e3));
    }

    private void seedSampleComplaint2(User farmer, Organization org) {
        Problem p = new Problem();
        p.setUser(farmer);
        p.setTitle("Deep Potholes and Waterlogging on Malihabad Mandi Link Road");
        p.setRawDescription("A 500-meter stretch of the link road connecting Malihabad Mango Orchards to the main Highway is completely broken with deep 1-foot craters. Mango trucks cannot pass.");
        p.setCategory(ProblemCategory.INFRASTRUCTURE);
        p.setSubCategory("Road Damage / Potholes");
        p.setUrgency(ProblemUrgency.HIGH);
        p.setStatus(ProblemStatus.VERIFICATION_PENDING);
        p.setVillageOrTown("Malihabad");
        p.setDistrict("Lucknow");
        p.setState("Uttar Pradesh");
        p.setPincode("226102");
        p.setAddress("Malihabad Mandi Approach Rd, Pillar No. 12");
        p.setContactPhone("9876543211");
        p.setContactName("Balram Singh");
        p.setLatitude(26.9200);
        p.setLongitude(80.7100);
        p.setAssignedOrganization(org);
        p.setAssignedAt(Instant.now().minus(Duration.ofDays(2)));
        p.setAcceptedAt(Instant.now().minus(Duration.ofDays(2)));
        p.setWorkStartedAt(Instant.now().minus(Duration.ofDays(1)));
        p.setResolvedAt(Instant.now().minus(Duration.ofHours(3)));
        p.setVerificationRequestedAt(Instant.now().minus(Duration.ofHours(3)));
        p.setSlaDeadline(Instant.now().plus(Duration.ofHours(20)));
        p.setSlaStatus("COMPLETED_WITHIN_SLA");
        p.setResolutionDescription("Heavy road roller, stone ballast, and hot bitumen macadam applied over 520 meters. Road fully levelled and opened for produce freight.");
        p.setActionTaken("Bitumen resurfacing & drainage trench clearing.");
        p.setResolverRemarks("Completed with 2-year maintenance guarantee by PWD Division 3.");

        Problem saved = problemRepository.save(p);
        String code = String.format("MANDI-2026-%06d", saved.getId());
        ProblemPassport passport = new ProblemPassport(saved, code);
        passport.setAiAnalysisSummary("Road infrastructure repair completed within 48h SLA.");
        passportRepository.save(passport);

        ProblemEvent e1 = new ProblemEvent(saved, ProblemStatus.DRAFT, ProblemStatus.ASSIGNED, "CREATE_COMPLAINT", "Road grievance logged.", farmer.getFullName(), farmer.getId());
        ProblemEvent e2 = new ProblemEvent(saved, ProblemStatus.ASSIGNED, ProblemStatus.IN_PROGRESS, "START_WORK", "PWD Road Roller & Asphalt crew deployed.", "Er. S.P. Verma", null);
        ProblemEvent e3 = new ProblemEvent(saved, ProblemStatus.IN_PROGRESS, ProblemStatus.RESOLVED, "MARK_RESOLVED", "Road repaired and leveled. Verification requested.", "Er. S.P. Verma", null);
        eventRepository.saveAll(List.of(e1, e2, e3));
    }

    private void seedSampleComplaint3(User citizen, Organization org) {
        Problem p = new Problem();
        p.setUser(citizen);
        p.setTitle("Broken Village Drinking Water Handpump Cylinder");
        p.setRawDescription("India Mark II handpump valve chain broke, leaving 45 families without potable drinking water.");
        p.setCategory(ProblemCategory.WATER_SANITATION);
        p.setSubCategory("Handpump Repair / Drinking Water");
        p.setUrgency(ProblemUrgency.MEDIUM);
        p.setStatus(ProblemStatus.CLOSED);
        p.setVillageOrTown("Mohanlalganj");
        p.setDistrict("Lucknow");
        p.setState("Uttar Pradesh");
        p.setPincode("226301");
        p.setAddress("Village Chaupal, Mohanlalganj");
        p.setContactPhone("9876543210");
        p.setContactName("Rameshwar Kumar");
        p.setLatitude(26.6700);
        p.setLongitude(80.9800);
        p.setAssignedOrganization(org);
        p.setAssignedAt(Instant.now().minus(Duration.ofDays(4)));
        p.setResolvedAt(Instant.now().minus(Duration.ofDays(2)));
        p.setCompletedAt(Instant.now().minus(Duration.ofDays(2)));
        p.setClosedAt(Instant.now().minus(Duration.ofDays(2)));
        p.setSlaStatus("COMPLETED_WITHIN_SLA");
        p.setResolutionDescription("Replaced pump piston cylinder, seal ring, and 2 connecting rods. Clean water discharge restored.");
        p.setFeedbackRating(5);
        p.setFeedbackComments("Quick 24-hour response. The technician arrived on time and repaired the pump cleanly.");
        p.setFeedbackTags("FAST_RESOLUTION,COMPLETELY_SOLVED,PROFESSIONAL_SERVICE");

        Problem saved = problemRepository.save(p);
        String code = String.format("MANDI-2026-%06d", saved.getId());
        ProblemPassport passport = new ProblemPassport(saved, code);
        passport.setAiAnalysisSummary("Water handpump repaired and verified with 5-star citizen rating.");
        passport.setUserRating(5);
        passport.setUserFeedback("Quick 24-hour response. Repaired cleanly.");
        passport.setUserConfirmedResolution(true);
        passportRepository.save(passport);

        ProblemEvent e1 = new ProblemEvent(saved, ProblemStatus.DRAFT, ProblemStatus.ASSIGNED, "CREATE_COMPLAINT", "Handpump complaint registered.", citizen.getFullName(), citizen.getId());
        ProblemEvent e2 = new ProblemEvent(saved, ProblemStatus.ASSIGNED, ProblemStatus.RESOLVED, "MARK_RESOLVED", "Pump valve replaced.", "Jal Nigam Service Team", null);
        ProblemEvent e3 = new ProblemEvent(saved, ProblemStatus.RESOLVED, ProblemStatus.CLOSED, "SUBMIT_FEEDBACK_AND_CLOSE", "Citizen verified resolution and gave 5★ rating.", citizen.getFullName(), citizen.getId());
        eventRepository.saveAll(List.of(e1, e2, e3));
    }

    private void fixNullTicketCodes() {
        try {
            List<Problem> problems = problemRepository.findAll();
            for (Problem p : problems) {
                if (p.getPassport() == null) {
                    String code = String.format("MANDI-2026-%06d", p.getId());
                    ProblemPassport passport = new ProblemPassport(p, code);
                    passport.setAiAnalysisSummary("Complaint #" + code + " logged.");
                    passportRepository.save(passport);
                    p.setPassport(passport);
                    problemRepository.save(p);
                }
            }
        } catch (Exception e) {
            log.warn("Ticket code verification note: {}", e.getMessage());
        }
    }

    private User createUser(String phone, String email, String name, String encPass, Set<Role> roles, String village, String district, Double lat, Double lon) {
        Optional<User> existing = userRepository.findByPhone(phone);
        if (existing.isPresent()) return existing.get();

        User user = new User(phone, email, encPass, name);
        user.setRoles(roles);
        user.setActive(true);
        user.setVerified(true);
        User saved = userRepository.save(user);

        UserProfile profile = new UserProfile(saved);
        profile.setVillageOrTown(village);
        profile.setDistrict(district);
        profile.setState("Uttar Pradesh");
        profile.setLatitude(lat);
        profile.setLongitude(lon);
        profile.setPreferredLanguage("HI");
        profile.setTrustScore(95);
        profileRepository.save(profile);

        return saved;
    }

    private void createResource(User owner, String name, ResourceCategory cat, String desc, String village, String district, Double lat, Double lon, Double cost, String unit, String phone, Double rating, int reviews) {
        Resource r = new Resource();
        r.setOwner(owner);
        r.setName(name);
        r.setCategory(cat);
        r.setDescription(desc);
        r.setVillageOrTown(village);
        r.setDistrict(district);
        r.setState("Uttar Pradesh");
        r.setLatitude(lat);
        r.setLongitude(lon);
        r.setCostPerUnit(cost);
        r.setCostUnit(unit);
        r.setContactPhone(phone);
        r.setRating(rating);
        r.setTotalReviews(reviews);
        r.setSuccessfulCasesCount(reviews);
        r.setAvailable(true);
        r.setVerified(true);
        resourceRepository.save(r);
    }

    private void createCrop(User farmer, String name, String variety, Double qty, Double price, LocalDate harvest, String village, String district, Double lat, Double lon) {
        Crop c = new Crop();
        c.setFarmer(farmer);
        c.setCropName(name);
        c.setVariety(variety);
        c.setQuantityQuintals(qty);
        c.setExpectedPricePerQuintal(price);
        c.setHarvestDate(harvest);
        c.setQualityGrade("Grade A");
        c.setVillageOrTown(village);
        c.setDistrict(district);
        c.setState("Uttar Pradesh");
        c.setLatitude(lat);
        c.setLongitude(lon);
        c.setStatus("AVAILABLE");
        c.setContactPhone(farmer.getPhone());
        c.setDescription("Freshly harvested " + name + " available directly from farm gate.");
        cropRepository.save(c);
    }

    private void createJob(User employer, String title, String category, String desc, Double comp, String type, int days, String village, String district, Double lat, Double lon) {
        JobPosting j = new JobPosting();
        j.setEmployer(employer);
        j.setTitle(title);
        j.setSkillCategory(category);
        j.setDescription(desc);
        j.setCompensationAmount(comp);
        j.setCompensationType(type);
        j.setDurationDays(days);
        j.setLocationName(village);
        j.setVillageOrTown(village);
        j.setDistrict(district);
        j.setLatitude(lat);
        j.setLongitude(lon);
        j.setStatus("OPEN");
        j.setContactPhone(employer.getPhone());
        jobPostingRepository.save(j);
    }

    private void createScheme(String name, String cat, String desc, String elig, String ben, String docs, String apply, String url, boolean isDemo) {
        GovernmentScheme s = new GovernmentScheme();
        s.setName(name);
        s.setCategory(cat);
        s.setDescription(desc);
        s.setEligibilityCriteria(elig);
        s.setBenefits(ben);
        s.setRequiredDocuments(docs);
        s.setApplicationMethod(apply);
        s.setOfficialSourceUrl(url);
        s.setDemoData(isDemo);
        s.setLastVerifiedDate(LocalDate.now().minusDays(15));
        schemeRepository.save(s);
    }

    private void repairLocationDistrictsAndStates() {
        try {
            List<Problem> problems = problemRepository.findAll();
            for (Problem p : problems) {
                String normDist = com.mandi.common.IndianLocationService.normalizeDistrict(p.getDistrict());
                String resolvedState = com.mandi.common.IndianLocationService.resolveState(normDist, p.getState());
                boolean changed = false;
                if (!normDist.equals(p.getDistrict())) {
                    p.setDistrict(normDist);
                    changed = true;
                }
                if (!resolvedState.equals(p.getState())) {
                    p.setState(resolvedState);
                    changed = true;
                }
                if (changed) {
                    problemRepository.save(p);
                }
            }

            List<UserProfile> profiles = profileRepository.findAll();
            for (UserProfile prof : profiles) {
                String normDist = com.mandi.common.IndianLocationService.normalizeDistrict(prof.getDistrict());
                String resolvedState = com.mandi.common.IndianLocationService.resolveState(normDist, prof.getState());
                boolean changed = false;
                if (!normDist.equals(prof.getDistrict())) {
                    prof.setDistrict(normDist);
                    changed = true;
                }
                if (!resolvedState.equals(prof.getState())) {
                    prof.setState(resolvedState);
                    changed = true;
                }
                if (changed) {
                    profileRepository.save(prof);
                }
            }
            log.info("📍 Verified and normalized district/state geographical mappings across problems and user profiles.");
        } catch (Exception e) {
            log.warn("Geographical repair notice: {}", e.getMessage());
        }

        seedVehiclesAndMitras();
    }

    private void seedVehiclesAndMitras() {
        try {
            // 1. Seed Vehicles if none exist
            if (vehicleRepository.count() == 0) {
                User provider = userRepository.findByPhone("9876543215")
                        .or(() -> userRepository.findByEmail("provider@mandi.org"))
                        .orElse(null);

                if (provider != null) {
                    com.mandi.transport.Vehicle v1 = new com.mandi.transport.Vehicle();
                    v1.setProvider(provider);
                    v1.setVehicleType(com.mandi.transport.VehicleType.TRACTOR_TROLLEY);
                    v1.setRegistrationNumber("PB65-TR-1234");
                    v1.setModelName("Mahindra 575 DI Tractor with Hydraulic Trolley (45 HP)");
                    v1.setCapacityTons(5.0);
                    v1.setCapacityQuintals(50.0);
                    v1.setDriverAvailable(true);
                    v1.setOwnerDriver(true);
                    v1.setBasePrice(450.0);
                    v1.setPricePerHour(450.0);
                    v1.setPricePerTrip(1200.0);
                    v1.setPricePerDay(3500.0);
                    v1.setMaxTravelRadiusKm(35);
                    v1.setServiceVillage("Gharuan");
                    v1.setServiceBlock("Kharar");
                    v1.setServiceDistrict("Mohali");
                    v1.setServiceState("Punjab");
                    v1.setLatitude(30.7716);
                    v1.setLongitude(76.5683);
                    v1.setRating(4.9);
                    v1.setTotalCompletedTrips(45);
                    v1.setActive(true);
                    vehicleRepository.save(v1);

                    com.mandi.transport.Vehicle v2 = new com.mandi.transport.Vehicle();
                    v2.setProvider(provider);
                    v2.setVehicleType(com.mandi.transport.VehicleType.MINI_TRUCK);
                    v2.setRegistrationNumber("UP32-AT-5678");
                    v2.setModelName("Tata Ace Gold Diesel Mini Truck");
                    v2.setCapacityTons(1.5);
                    v2.setCapacityQuintals(15.0);
                    v2.setDriverAvailable(true);
                    v2.setBasePrice(400.0);
                    v2.setPricePerKm(22.0);
                    v2.setPricePerTrip(850.0);
                    v2.setMaxTravelRadiusKm(50);
                    v2.setServiceVillage("Malihabad");
                    v2.setServiceBlock("Malihabad");
                    v2.setServiceDistrict("Lucknow");
                    v2.setServiceState("Uttar Pradesh");
                    v2.setLatitude(26.9200);
                    v2.setLongitude(80.7100);
                    v2.setRating(4.8);
                    v2.setTotalCompletedTrips(32);
                    v2.setActive(true);
                    vehicleRepository.save(v2);

                    com.mandi.transport.Vehicle v3 = new com.mandi.transport.Vehicle();
                    v3.setProvider(provider);
                    v3.setVehicleType(com.mandi.transport.VehicleType.PICKUP);
                    v3.setRegistrationNumber("PB65-PK-9012");
                    v3.setModelName("Mahindra Bolero Maxi Truck HD");
                    v3.setCapacityTons(2.5);
                    v3.setCapacityQuintals(25.0);
                    v3.setDriverAvailable(true);
                    v3.setBasePrice(500.0);
                    v3.setPricePerKm(26.0);
                    v3.setPricePerTrip(1100.0);
                    v3.setMaxTravelRadiusKm(45);
                    v3.setServiceVillage("Kharar");
                    v3.setServiceBlock("Kharar");
                    v3.setServiceDistrict("Mohali");
                    v3.setServiceState("Punjab");
                    v3.setLatitude(30.7450);
                    v3.setLongitude(76.6450);
                    v3.setRating(4.7);
                    v3.setTotalCompletedTrips(28);
                    v3.setActive(true);
                    vehicleRepository.save(v3);

                    log.info("🚚 Seeded 3 Multi-Type Transport Vehicles for Provider.");
                }
            }

            // 2. Seed Village Mitras if none exist
            if (mitraRepository.count() == 0) {
                User mitraUser = userRepository.findByPhone("9876543216")
                        .or(() -> userRepository.findByEmail("mitra@mandi.org"))
                        .orElse(null);

                if (mitraUser != null) {
                    com.mandi.mitra.VillageMitraProfile m1 = new com.mandi.mitra.VillageMitraProfile();
                    m1.setUser(mitraUser);
                    m1.setFullName("Rahul Kumar (MANDI Mitra)");
                    m1.setPhone("9876543216");
                    m1.setAssignedVillages("Gharuan, Kharar, Majatri, Bhagomajra");
                    m1.setAssignedBlock("Kharar");
                    m1.setAssignedDistrict("Mohali");
                    m1.setAssignedState("Punjab");
                    m1.setLatitude(30.7716);
                    m1.setLongitude(76.5683);
                    m1.setStatus("AVAILABLE");
                    m1.setServicesOffered("Agriculture Assistance, Transport Coordination, Crop Sales, Civic Grievance, Ground Verification");
                    m1.setRating(4.9);
                    m1.setTotalCoordinatedCases(42);
                    m1.setVerified(true);
                    m1.setActive(true);
                    mitraRepository.save(m1);
                    log.info("🌟 Seeded Village Mitra Coordinator profile for Mohali/Punjab.");
                }
            }
        } catch (Exception e) {
            log.warn("Vehicle & Mitra seeding notice: {}", e.getMessage());
        }
    }
}
