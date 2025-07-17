package com.example.demo2.entity;

import com.example.demo2.enums.NotificationTarget;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender; // "Admin" hoặc username người gửi

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationTarget targetRole; // ALL, MEMBER, COACH, ADMIN

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime sentAt;
}
