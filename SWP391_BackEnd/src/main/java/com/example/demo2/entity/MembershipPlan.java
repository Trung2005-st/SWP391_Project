package com.example.demo2.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class MembershipPlan {

    @Id
    private Long planID;

    private String name;
    private String description;
    private Double price;
    private Integer duration; // số ngày hoặc số tháng, tùy theo thiết kế

    @OneToMany(mappedBy = "membershipPlan")
    @JsonIgnore
    private List<User> users;

    // Optional: nếu bạn muốn ánh xạ tới UserPlanHistory và QuitPlan
    @OneToMany(mappedBy = "plan")
    private List<UserPlanHistory> userPlanHistories;

    @OneToMany(mappedBy = "plan")
    @JsonManagedReference
    private List<QuitPlan> quitPlans;
}
