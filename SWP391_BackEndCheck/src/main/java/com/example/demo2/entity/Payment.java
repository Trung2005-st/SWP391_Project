package com.example.demo2.entity;

import com.example.demo2.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    LocalDateTime createAt;
    LocalDateTime updateAt;

    @Enumerated(EnumType.STRING)
    PaymentStatus status;

    double amount;

    @ManyToOne
    @JoinColumn(name = "userMembership_id")
    @JsonIgnore
    UserMembership userMembership;
}
