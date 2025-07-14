package com.example.demo2.services;

import com.example.demo2.entity.Encouragement;
import com.example.demo2.repository.EncouragementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@Service
public class EncouragementService {

    @Autowired
    private EncouragementRepository repo;

    /** Coach/Admin sends a custom encouragement **/
    @Transactional
    public Encouragement sendCustom(Long senderId, Long receiverId, String message, String template) {
        Encouragement e = new Encouragement();
        e.setSenderId(senderId);
        e.setReceiverId(receiverId);
        e.setMessage(message);
        e.setTemplate(template);
        e.setSentAt(LocalDateTime.now());
        return repo.save(e);
    }

    /** User API: get today's encouragement, auto-generate if none **/
    @Transactional
    public Encouragement getOrGenerateToday(Long receiverId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        return repo.findByReceiverIdAndSentAtBetween(receiverId, start, end)
                .orElseGet(() -> {
                    Encouragement e = new Encouragement();
                    e.setReceiverId(receiverId);
                    e.setSenderId(0L); // system
                    e.setMessage("Keep going! You're doing great.");
                    e.setTemplate("default");
                    e.setSentAt(LocalDateTime.now());
                    return repo.save(e);
                });
    }

    public List<Encouragement> getHistory(Long receiverId) {
        return repo.findByReceiverIdOrderBySentAtDesc(receiverId);
    }
}

