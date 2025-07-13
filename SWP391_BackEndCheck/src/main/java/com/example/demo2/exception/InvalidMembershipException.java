package com.example.demo2.exception;

public class InvalidMembershipException extends RuntimeException {
    public InvalidMembershipException(String message) {
        super(message);
    }
}
