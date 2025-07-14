package com.example.demo2.exception;

public class MembershipPlanNotFoundException extends RuntimeException {
    public MembershipPlanNotFoundException(String message) {
        super(message);
    }
}
