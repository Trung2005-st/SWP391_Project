package com.example.demo2.dto;

import lombok.Data;

@Data
public class EncouragementRequest {
    private long senderId;
    private Long receiverId;
    private String message;
    private String template;

}
