package com.example.demo2.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyEmailRequest {
    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    String email;

    @NotBlank(message = "OTP is required")
    String otp;
}
