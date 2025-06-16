package com.example.demo2.api;

import com.example.demo2.model.request.ForgotPasswordRequest;
import com.example.demo2.model.request.ResetPasswordRequest;
import com.example.demo2.services.ForgotPasswordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ForgotPasswordAPI {

    @Autowired
    ForgotPasswordService forgotPasswordService;

    @PostMapping("/api/forgot-password")
    public ResponseEntity forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest){
        forgotPasswordService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok("Forgot Password successfully");
    }

    @PostMapping("/api/reset-password")
    public ResponseEntity resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest){
        forgotPasswordService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok("Reset Password successfully");
    }
}
