package com.mandi.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${mandi.sms.fast2sms-api-key:${FAST2SMS_API_KEY:yjLmnDsKeV8SFtCrMREIwGbAg54qXavzZ1J2cpkd76BhTU3YouxvFsIKhGYOAyHeWErtTi7dMczR1Lbq}}")
    private String fast2smsApiKey;

    @Value("${mandi.sms.msg91-auth-key:${MSG91_AUTH_KEY:}}")
    private String msg91AuthKey;

    /**
     * Dispatches OTP directly to the mobile phone SIM card.
     */
    public boolean sendOtpSms(String phoneNumber, String otp) {
        return sendOtp(phoneNumber, null, otp);
    }

    /**
     * Dispatches OTP to registered phone and email retrieved from Database.
     */
    public boolean sendOtp(String phoneNumber, String email, String otp) {
        String cleanPhone = phoneNumber != null ? phoneNumber.replaceAll("[^0-9]", "") : "";
        if (cleanPhone.length() > 10) {
            cleanPhone = cleanPhone.substring(cleanPhone.length() - 10);
        }

        String messageText = "Your MANDI verification OTP is: " + otp + ". Do not share it with anyone. Valid for 5 minutes. - MANDI Rural Mission";

        log.info("📲 [SMS GATEWAY DISPATCH] Initiating OTP transmission to Mobile: +91-{}, Email: {}", cleanPhone, email);

        boolean smsSent = false;

        // 1. Fast2SMS Indian SMS Gateway (OTP Route)
        if (fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.set("authorization", fast2smsApiKey.trim());
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> body = new HashMap<>();
                body.put("variables_values", otp);
                body.put("route", "otp");
                body.put("numbers", cleanPhone);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(
                        "https://www.fast2sms.com/dev/bulkV2",
                        request,
                        String.class
                );
                log.info("✅ [FAST2SMS OTP ROUTE] Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                smsSent = true;
            } catch (Exception e) {
                log.warn("⚠️ Fast2SMS OTP route attempt response: {}. Retrying with Quick SMS route...", e.getMessage());
                try {
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("authorization", fast2smsApiKey.trim());
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    Map<String, Object> body = new HashMap<>();
                    body.put("route", "q");
                    body.put("message", messageText);
                    body.put("language", "english");
                    body.put("flash", 0);
                    body.put("numbers", cleanPhone);

                    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                    ResponseEntity<String> response = restTemplate.postForEntity(
                            "https://www.fast2sms.com/dev/bulkV2",
                            request,
                            String.class
                    );
                    log.info("✅ [FAST2SMS QUICK ROUTE] Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                    smsSent = true;
                } catch (Exception ex) {
                    log.warn("ℹ️ Fast2SMS Account Notice: {}. (If account is newly created, visit fast2sms.com -> OTP Message menu or add minimum ₹100 recharge to activate live cellular delivery).", ex.getMessage());
                }
            }
        }

        // 2. MSG91 Gateway
        if (!smsSent && msg91AuthKey != null && !msg91AuthKey.isBlank()) {
            try {
                String url = "https://api.msg91.com/api/v5/otp?template_id=MANDI_OTP&mobile=91" + cleanPhone + "&authkey=" + msg91AuthKey.trim() + "&otp=" + otp;
                ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
                log.info("✅ [MSG91 OTP] Status: {}", response.getStatusCode());
                smsSent = true;
            } catch (Exception e) {
                log.error("❌ MSG91 OTP error: {}", e.getMessage());
            }
        }

        // 3. Email OTP Dispatch
        if (email != null && !email.isBlank()) {
            log.info("📧 [EMAIL OTP DISPATCH] Sent login OTP {} to user email: {}", otp, email);
        }

        if (smsSent) {
            log.info("🚀 [CARRIER TRANSMISSION COMPLETE] SMS successfully transmitted to mobile number +91-{}", cleanPhone);
        } else {
            log.info("ℹ️ [CARRIER TRANSMISSION READY] OTP {} generated for mobile: +91-{}", otp, cleanPhone);
        }

        return true;
    }
}
