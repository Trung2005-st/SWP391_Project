package com.example.demo2.exception;

public class CoachProfileNotFoundException extends RuntimeException {
    public CoachProfileNotFoundException(String message) {
        super(message);
    }
}
