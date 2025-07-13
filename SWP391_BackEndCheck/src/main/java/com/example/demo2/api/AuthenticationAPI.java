package com.example.demo2.api;

import com.example.demo2.entity.User;
import com.example.demo2.model.request.VerifyEmailRequest;
import com.example.demo2.model.request.registerRequest;
import com.example.demo2.model.response.AccountResponse;
import com.example.demo2.model.request.loginRequest;
import com.example.demo2.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authentication;

    @PostMapping("/api/register")
    public ResponseEntity register(@RequestBody @Valid registerRequest request) {
        authentication.register(request);
        return ResponseEntity.ok("OTP sent to " + request.getEmail() + ". Please verify to complete registration.");
    }


    // Step 2: Confirm OTP & create user
    @PostMapping("/api/register/verify")
    public ResponseEntity confirmOTP(@RequestBody VerifyEmailRequest verifyEmailRequest) {
        User user = authentication.confirmRegistration(verifyEmailRequest);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/api/register/resend-otp")
    public ResponseEntity resendOtp(@RequestParam String email) {
        authentication.resendOtp(email);
        return ResponseEntity.ok("OTP resent to " + email);
    }


    @PostMapping("/api/login")
    public ResponseEntity login(@Valid @RequestBody loginRequest account){
        AccountResponse acc= authentication.login(account);
        return ResponseEntity.ok(acc);
    }
}
