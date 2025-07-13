package com.example.demo2.model.request;

import lombok.Data;

@Data
public class MembershipPlanRequest {
    String name;
    String description;
    double price;
    int duration;
}
