package com.mandi.auth;

import com.mandi.auth.dto.*;
import com.mandi.exception.DuplicateResourceException;
import com.mandi.exception.ResourceNotFoundException;
import com.mandi.exception.UnauthorizedActionException;
import com.mandi.security.JwtUtils;
import com.mandi.security.UserPrincipal;
import com.mandi.user.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final com.mandi.common.SmsService smsService;

    private static class OtpEntry {
        private final String otp;
        private final long expiryTime;

        public OtpEntry(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }

        public boolean isValid(String inputOtp) {
            return !isExpired() && inputOtp != null && this.otp.equals(inputOtp.trim());
        }
    }

    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils,
                       com.mandi.common.SmsService smsService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.smsService = smsService;
    }

    private String normalizeIdentifier(String identifier) {
        if (identifier == null) return "";
        String trimmed = identifier.trim();
        if (trimmed.contains("@")) {
            return trimmed.toLowerCase();
        }
        // Remove spaces, dashes, or country code formatting if mobile
        String digits = trimmed.replaceAll("[^0-9]", "");
        if (digits.length() == 12 && digits.startsWith("91")) {
            digits = digits.substring(2);
        } else if (digits.length() == 11 && digits.startsWith("0")) {
            digits = digits.substring(1);
        }
        return digits.isEmpty() ? trimmed : digits;
    }

    private Optional<User> findUserByIdentifier(String identifier) {
        String norm = normalizeIdentifier(identifier);
        Optional<User> byPhone = userRepository.findByPhone(norm);
        if (byPhone.isPresent()) return byPhone;
        Optional<User> byEmail = userRepository.findByEmail(norm);
        if (byEmail.isPresent()) return byEmail;
        return userRepository.findByPhoneOrEmail(norm, norm);
    }

    public SendOtpResponse sendOtp(SendOtpRequest request) {
        String norm = normalizeIdentifier(request.getIdentifier());
        if (norm.isBlank()) {
            throw new IllegalArgumentException("Mobile number or Email ID is required to generate OTP.");
        }

        // Verify that the user exists in our records
        Optional<User> userOpt = findUserByIdentifier(norm);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("No registered account found with " + request.getIdentifier() + ". Please register first.");
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            throw new UnauthorizedActionException("This account is inactive or suspended. Please contact administrator.");
        }

        // Generate 6-digit cryptographic OTP
        int code = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(code);

        // Store OTP with 5 minute expiry (300,000 ms)
        long expiry = System.currentTimeMillis() + (5 * 60 * 1000);
        otpStorage.put(norm, new OtpEntry(otp, expiry));

        log.info("🔐 [MANDI OTP SERVICE] Generated OTP for user {} ({}): {}", user.getFullName(), norm, otp);

        // Dispatch real SMS directly to mobile SIM
        if (!norm.contains("@")) {
            smsService.sendOtpSms(norm, otp);
        }

        String mask = norm.contains("@")
                ? norm.replaceAll("(?<=.{2}).(?=.*@)", "*")
                : "+91 " + norm.substring(0, Math.min(2, norm.length())) + "******" + (norm.length() > 2 ? norm.substring(norm.length() - 2) : "");

        String message = "Verification OTP has been sent via SMS directly to your phone SIM (" + mask + "). Please check your SMS inbox.";

        return new SendOtpResponse(norm, otp, message, 300);
    }

    @Transactional
    public AuthResponse verifyOtpLogin(VerifyOtpRequest request) {
        String norm = normalizeIdentifier(request.getIdentifier());
        String inputOtp = request.getOtp() != null ? request.getOtp().trim() : "";

        if (norm.isBlank() || inputOtp.isBlank()) {
            throw new UnauthorizedActionException("Mobile/Email and OTP are both required.");
        }

        OtpEntry entry = otpStorage.get(norm);
        if (entry == null) {
            throw new UnauthorizedActionException("No OTP found for this identifier. Please request a new OTP.");
        }

        if (entry.isExpired()) {
            otpStorage.remove(norm);
            throw new UnauthorizedActionException("OTP has expired. Please click 'Resend OTP' to receive a fresh verification code.");
        }

        if (!entry.isValid(inputOtp)) {
            throw new UnauthorizedActionException("Invalid OTP entered. Please check the 6-digit code and try again.");
        }

        // OTP is valid - consume it immediately (one-time use)
        otpStorage.remove(norm);

        User user = findUserByIdentifier(norm)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for identifier: " + norm));

        if (!user.isActive()) {
            throw new UnauthorizedActionException("Account is inactive or suspended.");
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                userPrincipal.getAuthorities()
        );

        String jwt = jwtUtils.generateToken(authentication);

        Set<String> roles = user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toSet());

        String preferredLang = "HI";
        var profileOpt = userProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            preferredLang = profileOpt.get().getPreferredLanguage();
        }

        log.info("✅ [MANDI OTP LOGIN] Successfully authenticated user {} ({}) via verified OTP.", user.getFullName(), norm);

        return new AuthResponse(jwt, user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), roles, preferredLang);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("User with this phone number already exists: " + request.getPhone());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank() && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with this email already exists: " + request.getEmail());
        }

        User user = new User(
                request.getPhone(),
                request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail() : null,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName()
        );

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            if (request.getRoles().contains(Role.ROLE_ADMIN)) {
                if (!"MandiAdmin@123".equals(request.getAdminPasskey())) {
                    throw new UnauthorizedActionException("Invalid Admin Passkey. You must enter the correct passkey (MandiAdmin@123) to register as an Administrator.");
                }
            }
            roles.addAll(request.getRoles());
        } else {
            roles.add(Role.ROLE_CITIZEN);
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        String rawDist = request.getDistrict() != null && !request.getDistrict().isBlank() ? request.getDistrict() : "Lucknow";
        String dist = com.mandi.common.IndianLocationService.normalizeDistrict(rawDist);
        String state = com.mandi.common.IndianLocationService.resolveState(dist, request.getState());

        UserProfile profile = new UserProfile(savedUser);
        profile.setVillageOrTown(request.getVillageOrTown());
        profile.setDistrict(dist);
        profile.setState(state);
        profile.setPincode(request.getPincode());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        profile.setPreferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "HI");
        userProfileRepository.save(profile);

        savedUser.setProfile(profile);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword())
        );

        String jwt = jwtUtils.generateToken(authentication);
        Set<String> roleNames = roles.stream().map(Role::name).collect(Collectors.toSet());

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getFullName(), savedUser.getPhone(), savedUser.getEmail(), roleNames, profile.getPreferredLanguage());
    }

    public AuthResponse login(LoginRequest request) {
        return processLogin(request, false, false);
    }

    public AuthResponse userLogin(LoginRequest request) {
        return processLogin(request, true, false);
    }

    public AuthResponse adminLogin(LoginRequest request) {
        return processLogin(request, false, true);
    }

    private AuthResponse processLogin(LoginRequest request, boolean isUserPortal, boolean isAdminPortal) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        boolean hasAdminRole = roles.contains("ROLE_ADMIN") || roles.contains("ROLE_SUPER_ADMIN") || roles.contains("ROLE_MODERATOR") || roles.contains("ADMIN");

        if (isAdminPortal) {
            if (!hasAdminRole) {
                throw new UnauthorizedActionException("Access Denied: Only authorized administrators and moderators can log in to the Admin Operations Center.");
            }
        }

        if (isUserPortal && hasAdminRole && roles.size() == 1) {
            // Strictly admin-only account trying to login via citizen portal
            throw new UnauthorizedActionException("This account belongs to the Administrator Portal. Please use the Admin Portal at /admin/login.");
        }

        String jwt = jwtUtils.generateToken(authentication);

        String preferredLang = "HI";
        var profileOpt = userProfileRepository.findByUserId(userPrincipal.getId());
        if (profileOpt.isPresent()) {
            preferredLang = profileOpt.get().getPreferredLanguage();
        }

        return new AuthResponse(jwt, userPrincipal.getId(), userPrincipal.getFullName(), userPrincipal.getPhone(), userPrincipal.getEmail(), roles, preferredLang);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedActionException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
