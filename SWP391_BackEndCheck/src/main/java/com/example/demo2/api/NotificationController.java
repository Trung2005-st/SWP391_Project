package com.example.demo2.api;

import com.example.demo2.dto.NotificationDTO;
import com.example.demo2.enums.NotificationTarget;
import com.example.demo2.services.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public NotificationDTO sendNotification(@RequestBody NotificationDTO dto) {
        return notificationService.createNotification(dto);
    }

    @GetMapping
    public List<NotificationDTO> getAll() {
        return notificationService.getAll();
    }

    @GetMapping("/role/{role}")
    public List<NotificationDTO> getByTarget(@PathVariable NotificationTarget role) {
        return notificationService.getByTarget(role);
    }
}
