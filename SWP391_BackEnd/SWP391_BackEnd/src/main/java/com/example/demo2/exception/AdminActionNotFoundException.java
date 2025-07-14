package com.example.demo2.exception;

public class AdminActionNotFoundException extends RuntimeException {
    public AdminActionNotFoundException(String message) {
        super(message);
    }
}
