package com.example.demo2.services;

import com.example.demo2.config.JwtBlackList;
import com.example.demo2.dto.EmailDetail;
import com.example.demo2.entity.User;
import com.example.demo2.enums.OtpPurpose;
import com.example.demo2.exception.AccountNotFoundException;
import com.example.demo2.exception.BadRequestException;
import com.example.demo2.model.request.ForgotPasswordRequest;
import com.example.demo2.model.request.ResetPasswordRequest;
import com.example.demo2.model.request.VerifyEmailRequest;
import com.example.demo2.repository.AuthenticationRepository;
import io.jsonwebtoken.Claims;
import javassist.NotFoundException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ForgotPasswordService {
    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    OTPService otpService;

    @Autowired
    TokenService tokenService;

    @Autowired
    private JwtBlackList jwtBlackList;

    public void forgotPassword(ForgotPasswordRequest forgotPasswordRequest){
        User user = authenticationRepository.findUserByEmail(forgotPasswordRequest.getEmail());

        if(user == null){
            throw new AccountNotFoundException("Email doesn't exist or hasn't been found");
        }
        else{
            EmailDetail emailDetail = new EmailDetail();
            emailDetail.setRecipient(user.getEmail());
            emailDetail.setSubject("Password Reset OTP");

            otpService.sendOTPEmail(emailDetail, OtpPurpose.RESET_PASSWORD); // generate + email + store OTP
        }
    }


    public String requestOtp(VerifyEmailRequest verifyEmailRequest){
        boolean ok = otpService.verifyOTP(verifyEmailRequest.getEmail(),  verifyEmailRequest.getOtp(), OtpPurpose.RESET_PASSWORD);
        if (!ok) {
            throw new BadRequestException("Invalid or expired OTP.");
        }
        // OTP hợp lệ → sinh reset-token
        String resetToken = tokenService.generateResetToken(verifyEmailRequest.getEmail());

        // dọn OTP
        otpService.remove(verifyEmailRequest.getEmail(), OtpPurpose.RESET_PASSWORD);

        return resetToken;          // trả về FE
    }



    public void resetPassword(ResetPasswordRequest req) {

        // Giải mã token, lấy email
        String email = tokenService.extractClaim(
                req.getResetToken(), Claims::getSubject);

        User user = authenticationRepository.findUserByEmail(email);
        if (user == null) throw new AccountNotFoundException("User not found");

        user.setPassword(passwordEncoder.encode(req.getPassword()));
        authenticationRepository.save(user);

        // Blacklist token
        Claims claims = tokenService.extractAllChains(req.getResetToken());
        jwtBlackList.add(req.getResetToken(), claims.getExpiration().getTime());
    }
}
