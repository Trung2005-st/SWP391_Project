package com.example.demo2.services;

import com.example.demo2.dto.AppointmentDTO;
import com.example.demo2.entity.Appointment;
import com.example.demo2.entity.User;
import com.example.demo2.repository.AppointmentRepository;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.utils.AccountUtils;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    // Danh sách link Google Meet đã tạo sẵn (có thể thêm nhiều link)
    private static final String[] MEET_LINKS = {
            "https://meet.google.com/ngv-psqv-mfp",
            "https://meet.google.com/gkb-vbcs-fis",
            "https://meet.google.com/mnr-vzpm-oxs",
            "https://meet.google.com/ueb-pvnc-ekx",
            "https://meet.google.com/btr-qspx-hnw"
    };

    private final Random random = new Random();

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO dto) {
        User user = AccountUtils.getCurrentAccount();
        Optional<User> doctorOpt = userRepository.findById(dto.getDoctorId());
        if (doctorOpt.isEmpty()) throw new RuntimeException("Doctor not found");
        User doctor = doctorOpt.get();

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);

        LocalDateTime createdAt = LocalDateTime.now();
        appointment.setCreatedAt(createdAt);

        String shift = dto.getShift();
        String startHour = shift.split("-")[0];
        LocalTime shiftStart = LocalTime.parse(startHour);
        LocalDateTime appointmentDate = createdAt.plusDays(1)
                .withHour(shiftStart.getHour())
                .withMinute(shiftStart.getMinute())
                .withSecond(0)
                .withNano(0);
        appointment.setAppointmentDate(appointmentDate);

        appointment.setSymptoms(dto.getSymptoms());
        appointment.setGoals(dto.getGoals());
        appointment.setHistory(dto.getHistory());
        appointment.setFrequency(dto.getFrequency());
        appointment.setShift(shift);

        // Lấy random link Meet
        String meetLink = MEET_LINKS[random.nextInt(MEET_LINKS.length)];
        appointment.setMeetUrl(meetLink);

        appointment = appointmentRepository.save(appointment);
        return AppointmentDTO.fromEntity(appointment);
    }

    public List<Appointment> getAppointmentsByUser(Long userId) {
        return appointmentRepository.findByUser_UserID(userId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctor_UserID(doctorId);
    }

    public void cancelAppointment(Long appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

    @Transactional
    public AppointmentDTO updateAppointment(Long appointmentId, AppointmentDTO dto) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);
        if (optionalAppointment.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }

        Appointment appointment = optionalAppointment.get();

        // Cập nhật các trường
        appointment.setSymptoms(dto.getSymptoms());
        appointment.setGoals(dto.getGoals());
        appointment.setHistory(dto.getHistory());
        appointment.setFrequency(dto.getFrequency());
        appointment.setShift(dto.getShift());

        // Cập nhật appointmentDate dựa vào shift (slot)
        String shift = dto.getShift();
        String startHour = shift.split("-")[0];
        LocalTime shiftStart = LocalTime.parse(startHour);

        LocalDateTime newDateTime = appointment.getCreatedAt()
                .toLocalDate()
                .plusDays(1)
                .atTime(shiftStart);
        appointment.setAppointmentDate(newDateTime);

        // Không đổi doctor, user, meetUrl

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentDTO.fromEntity(saved);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll(Sort.by(Sort.Direction.DESC, "appointmentDate"));
    }

}
