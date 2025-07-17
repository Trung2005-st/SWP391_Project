package com.example.demo2.dto;

import com.example.demo2.enums.NotificationTarget;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private String sender;
    private NotificationTarget targetRole; // ALL, MEMBER, COACH, ADMIN
    private String message;
    private LocalDateTime sentAt;
}
