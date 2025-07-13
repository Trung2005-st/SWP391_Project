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
import java.util.List;

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

    @OneToMany(mappedBy = "user")
    List<QuitPlan> quitPlans;

    @NotBlank(message="Username must not be blank!")
    @Column(unique = true)
    private String username;

    @NotBlank(message= "password must not null")
    
    private String password;

    @Column(nullable = false)
    private int role;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Date joinDate;

    @Email(message = "Invalid Email!")
    private String email;

    @Column(name="is_verified", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isVerified;

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

    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties("user")
    private List<BlogDetail> blogDetails;

    //membership relationship
    @OneToMany(mappedBy = "user")
    List<UserMembership> userMemberships;

}

//mô hình 3 lớp:
//api (controller): nhận request => giao task cho service
//service: thực thi logic
//repository (dao): tương tác db