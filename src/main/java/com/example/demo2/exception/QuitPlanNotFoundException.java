package com.example.demo2.exception;

public class QuitPlanNotFoundException extends RuntimeException {
    public QuitPlanNotFoundException(String message) {
        super(message);
    }
}
