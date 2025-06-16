package com.example.demo2.entity;

import com.example.demo2.enums.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

// để cho biết class model này sẽ tham chiếu vô db (và tự tạo , update nếu có)
@Entity
@Getter
@Setter
//nếu extend Model+Details thì sẽ kích hoạt security cho (account) model này
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    // Trong User.java
    @ManyToOne
    @JoinColumn(name= "planID")
@JsonIgnoreProperties({"users","userPlanHistories","quitPlans"})
    private MembershipPlan membershipPlan;

    @NotBlank(message="Username must not be blank!")
    private String username;

    private String password;

    @Column(nullable = false)
    private int role;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Date joinDate;

    @Email(message = "Invalid Email!")
    private String email;

    private Integer isVerified;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<>();
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }
}

//mô hình 3 lớp:
//api (controller): nhận request => giao task cho service
//service: thực thi logic
//repository (dao): tương tác db