package com.example.demo2.repository;

import com.example.demo2.entity.Encouragement;
import com.example.demo2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EncouragementRepository extends JpaRepository<Encouragement, Long> {
    Optional<Encouragement> findByReceiverIdAndSentAtBetween(Long receiverId, LocalDateTime start, LocalDateTime end);
    List<Encouragement> findByReceiverIdOrderBySentAtDesc(Long receiverId);

}