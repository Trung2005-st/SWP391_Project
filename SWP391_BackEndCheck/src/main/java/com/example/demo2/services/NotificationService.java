package com.example.demo2.services;

import com.example.demo2.dto.NotificationDTO;
import com.example.demo2.entity.Notification;
import com.example.demo2.enums.NotificationTarget;
import com.example.demo2.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification n = new Notification();
        n.setSender(dto.getSender());
        n.setTargetRole(dto.getTargetRole());
        n.setMessage(dto.getMessage());
        n.setSentAt(LocalDateTime.now());
        n = notificationRepository.save(n);

        dto.setId(n.getId());
        dto.setSentAt(n.getSentAt());
        return dto;
    }

    public List<NotificationDTO> getAll() {
        return notificationRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<NotificationDTO> getByTarget(NotificationTarget target) {
        return notificationRepository.findByTargetRole(target).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setSender(n.getSender());
        dto.setTargetRole(n.getTargetRole());
        dto.setMessage(n.getMessage());
        dto.setSentAt(n.getSentAt());
        return dto;
    }
}
