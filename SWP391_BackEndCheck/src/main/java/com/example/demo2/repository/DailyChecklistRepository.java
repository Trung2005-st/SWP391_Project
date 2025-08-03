package com.example.demo2.repository;

import com.example.demo2.entity.DailyCheckList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


public interface DailyChecklistRepository extends JpaRepository<DailyCheckList, Long> {
    @Query("SELECT c FROM DailyCheckList c WHERE c.userId = :userId AND FUNCTION('DATE', c.date) = :date")
    List<DailyCheckList> findAllByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Modifying
    @Query(value = "DELETE FROM daily_checklist WHERE user_id = :userId AND DATE(date) = :date", nativeQuery = true)
    void deleteAllByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

}