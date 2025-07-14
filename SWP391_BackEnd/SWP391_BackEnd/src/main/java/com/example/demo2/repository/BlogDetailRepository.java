package com.example.demo2.repository;

import com.example.demo2.entity.BlogDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogDetailRepository extends JpaRepository<BlogDetail, Long> {
    List<BlogDetail> findByUser_UserID(Long userId);
}
