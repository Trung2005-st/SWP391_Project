// src/main/java/com/example/demo2/repository/FeedbackRepository.java
package com.example.demo2.repository;

import com.example.demo2.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("""
    SELECT AVG(
        CASE f.emoji
            WHEN '😡' THEN 1
            WHEN '😞' THEN 2
            WHEN '🙂' THEN 3
            WHEN '😊' THEN 4
            WHEN '😍' THEN 5
            ELSE NULL
        END
    )
    FROM Feedback f
    WHERE f.emoji IS NOT NULL
""")
    Double getAverageEmojiScore();
}
