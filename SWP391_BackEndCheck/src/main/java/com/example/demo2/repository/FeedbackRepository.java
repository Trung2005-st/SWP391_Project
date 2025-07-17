// src/main/java/com/example/demo2/repository/FeedbackRepository.java
package com.example.demo2.repository;

import com.example.demo2.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
