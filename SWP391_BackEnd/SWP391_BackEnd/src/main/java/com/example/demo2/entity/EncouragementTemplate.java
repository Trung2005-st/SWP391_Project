package com.example.demo2.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EncouragementTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. background image or style identifier
    private String templateName;
    private String backgroundUrl;

    @Column(columnDefinition = "TEXT")
    private String defaultMessage;

    private LocalDate createdAt;
    private String createdBy; // coach or admin username
}