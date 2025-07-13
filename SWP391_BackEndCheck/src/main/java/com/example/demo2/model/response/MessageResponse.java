package com.example.demo2.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private Long messageId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime time;
}