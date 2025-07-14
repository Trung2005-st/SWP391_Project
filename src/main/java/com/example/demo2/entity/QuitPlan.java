package com.example.demo2.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.Date;
@Entity
@Getter
@Setter
public class QuitPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quitID;  // Đây là ID riêng cho mỗi bản ghi QuitPlan//

     @ManyToOne
     @JoinColumn(name = "userID",nullable = false)
     private User user;

     @ManyToOne
     @JoinColumn(name = "planID",nullable = false)
     @JsonBackReference
     private MembershipPlan plan;

     private Date startDate;
     private Date endDate;
     private String reason;
     private String stage;
}