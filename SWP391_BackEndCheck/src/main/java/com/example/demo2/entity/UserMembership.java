package com.example.demo2.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class UserMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userid")
    @JsonIgnore
    User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "planid")
    @JsonIgnore
    MembershipPlan membershipPlan;

    LocalDate startDate;
    LocalDate endDate;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "userMembership")
    List<Payment> payments;

}
