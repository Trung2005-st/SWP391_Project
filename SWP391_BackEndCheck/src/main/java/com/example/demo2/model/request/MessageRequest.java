package com.example.demo2.model.request;

import lombok.Data;

@Data
public class MessageRequest {
    private Long senderId;
    private Long receiverId;
    private String content;
}
