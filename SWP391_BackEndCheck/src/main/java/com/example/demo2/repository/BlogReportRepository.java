package com.example.demo2.repository;

import com.example.demo2.entity.BlogReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface BlogReportRepository extends JpaRepository<BlogReport, Long> {
    List<BlogReport> findByBlog_BlogID(Long blogID);
    int countByBlog_BlogID(Long blogID);
}