package com.example.demo2.repository;

import com.example.demo2.entity.CoachProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachProfileRepository extends JpaRepository<CoachProfile, Long> {
}