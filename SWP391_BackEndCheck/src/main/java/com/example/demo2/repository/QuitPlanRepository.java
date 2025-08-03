package com.example.demo2.repository;

import com.example.demo2.entity.QuitPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuitPlanRepository extends JpaRepository<QuitPlan, Long> {
    // Tính tổng số tiền tiết kiệm dựa trên ngày và thói quen hút thuốc
    @Query("""
        SELECT SUM(
            DATEDIFF(q.endDate, q.startDate) * 
            s.cigarettesPerDay * 
            (s.packCost / s.cigarettesPerPack)
        )
        FROM QuitPlan q
        JOIN UserPlanStats s ON q.user.userID = s.userId
        WHERE q.startDate IS NOT NULL AND q.endDate IS NOT NULL
    """)
    Double calculateTotalMoneySaved();

    @Query("""
    SELECT q FROM QuitPlan q
    JOIN FETCH q.user u
    JOIN FETCH UserPlanStats s ON u.userID = s.userId
    WHERE q.startDate IS NOT NULL AND q.endDate IS NOT NULL
""")
    List<QuitPlan> findAllWithStats();
}
