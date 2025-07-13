package com.example.demo2.repository;

import com.example.demo2.entity.CoachRegisterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachRegisterInfoRepository extends JpaRepository<CoachRegisterInfo, Long> {
}
