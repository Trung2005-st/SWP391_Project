package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User đặt lịch (lấy từ token)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Coach/Doctor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private User doctor;

    // Dấu thời gian đặt lịch
    private LocalDateTime createdAt;

    // Ngày giờ mong muốn hẹn (có thể dùng mặc định createdAt nếu form không chọn ngày)
    private LocalDateTime appointmentDate;

    // Chuỗi checkbox các triệu chứng
    @ElementCollection
    private List<String> symptoms;

    // Chuỗi checkbox các mục tiêu
    @ElementCollection
    private List<String> goals;

    // Lịch sử bệnh (1 giá trị)
    private String history;

    // Tần suất thèm hút
    private String frequency;

    // Khung giờ
    private String shift;

    private String meetUrl;
}
