package com.example.demo2.entity;

import com.example.demo2.entity.User;
import com.example.demo2.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class CoachRegisterInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    @NotBlank(message = "Reason must not be blank")
    @Column(length = 500, nullable = false)
    private String reason;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date registerDate = new Date();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status ;
}
