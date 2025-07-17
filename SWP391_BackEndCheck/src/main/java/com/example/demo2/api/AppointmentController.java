package com.example.demo2.api;

import com.example.demo2.dto.AppointmentDTO;
import com.example.demo2.entity.Appointment;
import com.example.demo2.services.AppointmentService;
import com.example.demo2.utils.AccountUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Đặt lịch
    @PostMapping
    public ResponseEntity<AppointmentDTO> book(@RequestBody AppointmentDTO dto) {
        AppointmentDTO created = appointmentService.bookAppointment(dto);
        return ResponseEntity.ok(created);
    }

    // Lấy lịch đã đặt của user hiện tại - TRẢ VỀ DTO
    @GetMapping("/my")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments() {
        Long userId = AccountUtils.getCurrentAccount().getUserID();
        List<Appointment> appointments = appointmentService.getAppointmentsByUser(userId);
        List<AppointmentDTO> dtos = appointments.stream()
                .map(AppointmentDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/for-coach")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsForCurrentCoach() {
        Long coachId = AccountUtils.getCurrentAccount().getUserID();
        System.out.println("==> /for-coach, coachId: " + coachId);
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(coachId);
        List<AppointmentDTO> dtos = appointments.stream()
                .map(AppointmentDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

}
