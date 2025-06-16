package com.example.demo2.repository;

import com.example.demo2.entity.AdminAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminAction, Long> {
}
