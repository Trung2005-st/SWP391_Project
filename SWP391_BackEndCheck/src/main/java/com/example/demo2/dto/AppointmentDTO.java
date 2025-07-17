package com.example.demo2.dto;

import com.example.demo2.entity.Appointment;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AppointmentDTO {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String userName;
    private LocalDateTime appointmentDate;
    private List<String> symptoms;
    private List<String> goals;
    private String history;
    private String frequency;
    private String shift;
    private String meetUrl;

    public static AppointmentDTO fromEntity(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getUserID());
            dto.setDoctorName(appointment.getDoctor().getUsername());
        }
        if (appointment.getUser() != null) {
            dto.setUserName(appointment.getUser().getUsername());
        }
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setSymptoms(appointment.getSymptoms());
        dto.setGoals(appointment.getGoals());
        dto.setHistory(appointment.getHistory());
        dto.setFrequency(appointment.getFrequency());
        dto.setShift(appointment.getShift());
        dto.setMeetUrl(appointment.getMeetUrl());
        return dto;
    }
}
