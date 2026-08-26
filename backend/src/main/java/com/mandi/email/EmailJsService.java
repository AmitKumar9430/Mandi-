package com.mandi.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailJsService {

    private static final Logger log = LoggerFactory.getLogger(EmailJsService.class);

    private static final String EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${mandi.emailjs.service-id:service_9qysbj8}")
    private String serviceId;

    @Value("${mandi.emailjs.public-key:mZNHwW-FUTEuLUHWu}")
    private String publicKey;

    @Value("${mandi.emailjs.registration-template-id:template_kmzf1sl}")
    private String registrationTemplateId;

    @Value("${mandi.emailjs.login-template-id:template_e25o3p8}")
    private String loginTemplateId;

    @Value("${mandi.emailjs.private-key:miSYTFDFm8kUATVBf57oa}")
    private String privateKey;

    /**
     * Sends Login OTP email via EmailJS template.
     */
    public boolean sendLoginOtpEmail(String recipientEmail, String recipientName, String otp) {
        return sendEmailJsMessage(loginTemplateId, recipientEmail, recipientName, otp, "LOGIN");
    }

    /**
     * Sends Registration OTP email via EmailJS template.
     */
    public boolean sendRegistrationOtpEmail(String recipientEmail, String recipientName, String otp) {
        return sendEmailJsMessage(registrationTemplateId, recipientEmail, recipientName, otp, "REGISTRATION");
    }

    private boolean sendEmailJsMessage(String templateId, String email, String name, String otp, String purpose) {
        if (email == null || email.isBlank()) {
            log.warn("⚠️ Cannot send EmailJS OTP: recipient email is missing or empty.");
            return false;
        }

        String safeName = (name != null && !name.isBlank()) ? name.trim() : "MANDI User";
        String maskedEmail = maskEmail(email);

        log.info("📧 [EMAILJS DISPATCH] Initiating {} OTP email transmission to: {} (Template: {})",
                purpose, maskedEmail, templateId);

        try {
            String cleanEmail = email.trim().toLowerCase();
            Map<String, String> templateParams = new HashMap<>();
            templateParams.put("email", cleanEmail);
            templateParams.put("to_email", cleanEmail);
            templateParams.put("user_email", cleanEmail);
            templateParams.put("recipient_email", cleanEmail);
            templateParams.put("name", safeName);
            templateParams.put("to_name", safeName);
            templateParams.put("user_name", safeName);
            templateParams.put("otp", otp);
            templateParams.put("code", otp);
            templateParams.put("passcode", otp);
            templateParams.put("time", "5 minutes");

            Map<String, Object> payload = new HashMap<>();
            payload.put("service_id", serviceId.trim());
            payload.put("template_id", templateId.trim());
            payload.put("user_id", publicKey.trim());
            if (privateKey != null && !privateKey.isBlank()) {
                payload.put("accessToken", privateKey.trim());
            }
            payload.put("template_params", templateParams);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            log.info("📧 [EMAILJS DISPATCH] Transmitting {} OTP [{}] to email: {}", purpose, otp, cleanEmail);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EMAILJS_API_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("✅ [EMAILJS SUCCESS] {} OTP email successfully delivered to {} via EmailJS.", purpose, maskedEmail);
                return true;
            } else {
                log.error("❌ [EMAILJS FAILED] EmailJS returned status {}: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.error("❌ [EMAILJS ERROR] Failed to dispatch {} OTP email to {}: {}", purpose, maskedEmail, e.getMessage());
            return false;
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "masked@domain.com";
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 2) return name.charAt(0) + "*@" + domain;
        return name.substring(0, 2) + "***@" + domain;
    }
}
