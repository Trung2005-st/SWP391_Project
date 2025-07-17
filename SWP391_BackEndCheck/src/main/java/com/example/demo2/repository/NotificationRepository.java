package com.example.demo2.repository;

import com.example.demo2.entity.Notification;
import com.example.demo2.enums.NotificationTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetRole(NotificationTarget targetRole);
}
