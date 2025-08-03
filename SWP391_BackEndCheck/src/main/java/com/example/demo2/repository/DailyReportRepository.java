package com.example.demo2.repository;

import com.example.demo2.entity.DailyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DailyReportRepository extends JpaRepository<DailyReport, Long> {

    @Query("SELECT SUM(r.smokedCigars) FROM DailyReport r WHERE r.userId = :userId")
    Integer getTotalAvoided(@Param("userId") Integer userId);

    @Query("SELECT COUNT(DISTINCT r.date) FROM DailyReport r WHERE r.userId = :userId")
    Integer getTotalDays(@Param("userId") Integer userId);



    List<DailyReport> findAllByUserId(Integer userId); // ✅ dùng cho getReportHistory

    @Query("SELECT r.date AS date, r.smokedCigars AS smokedCigars FROM DailyReport r WHERE r.userId = :userId ORDER BY r.date ASC")
    List<Object[]> getCigaretteHistory(@Param("userId") Integer userId);

    List<DailyReport> findAllByUserIdAndDate(Long userId, LocalDate date);

}
