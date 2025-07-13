package com.example.demo2.repository;

import com.example.demo2.entity.Encouragement;
import com.example.demo2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncouragementRepository extends JpaRepository<Encouragement, Long> {
    List<Encouragement> findByReceiver(User receiver);
    List<Encouragement> findBySender(User sender);

}