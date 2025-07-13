package com.example.demo2.repository;

import com.example.demo2.entity.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {
}
