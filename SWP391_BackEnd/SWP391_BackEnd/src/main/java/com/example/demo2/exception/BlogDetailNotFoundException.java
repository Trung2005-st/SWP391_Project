package com.example.demo2.exception;

public class BlogDetailNotFoundException extends RuntimeException {
    public BlogDetailNotFoundException(String message) {
        super(message);
    }
}
