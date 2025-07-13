package com.example.demo2.services;

import com.example.demo2.dto.EmailDetail;
import com.example.demo2.dto.OTPInfo;
import com.example.demo2.enums.OtpPurpose;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPService {
    private final Map<String, OTPInfo> otpStore = new ConcurrentHashMap<>();

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private JavaMailSender javaMailSender;


    private String getKey(String email, OtpPurpose purpose) {
        return email + ":" + purpose.name();
    }

    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

    public void sendOTPEmail(EmailDetail emailDetail, OtpPurpose purpose) {
        try {
            String otp = generateOTP();

            OTPInfo otpInfo = new OTPInfo(otp, LocalDateTime.now().plusMinutes(10));
            otpStore.put(getKey(emailDetail.getRecipient(), purpose), otpInfo);

            Context context = new Context();
            context.setVariable("name", emailDetail.getRecipient());
            context.setVariable("otp", otp);

            String html = templateEngine.process("otp-email-template", context);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);

            helper.setFrom("dangkhoa1232001@gmail.com");
            helper.setTo(emailDetail.getRecipient());
            helper.setSubject(emailDetail.getSubject());
            helper.setText(html, true);

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            System.out.println("Failed to send OTP: " + e.getMessage());
        }
    }

    // OTP verification method
    public boolean verifyOTP(String email, String inputOtp, OtpPurpose purpose) {
        OTPInfo otpInfo = otpStore.get(getKey(email, purpose));
        if (otpInfo == null) return false;
        if (otpInfo.getExpiryTime().isBefore(LocalDateTime.now())) return false;
        if (!otpInfo.getOtp().equals(inputOtp)) return false;

        otpStore.remove(getKey(email, purpose));
        return true;
    }

    public void save(String email, OTPInfo otp, OtpPurpose purpose) {
        otpStore.put(getKey(email, purpose), otp);
    }

    public OTPInfo get(String email, OtpPurpose purpose) {
        return otpStore.get(getKey(email, purpose));
    }

    public void remove(String email, OtpPurpose purpose) {
        otpStore.remove(getKey(email, purpose));
    }
}
