package com.example.demo2.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OTPInfo {
    private String otp;
    private LocalDateTime expiryTime;

    public OTPInfo(String otp, LocalDateTime expiryTime) {
        this.otp = otp;
        this.expiryTime = expiryTime;
    }
}
