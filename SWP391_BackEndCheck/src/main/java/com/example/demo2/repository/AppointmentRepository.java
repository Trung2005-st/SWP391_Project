package com.example.demo2.repository;

import com.example.demo2.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser_UserID(Long userId);
    List<Appointment> findByDoctor_UserID(Long doctorId);
}
