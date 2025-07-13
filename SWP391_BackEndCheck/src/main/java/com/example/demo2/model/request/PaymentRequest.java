package com.example.demo2.model.request;

import com.example.demo2.entity.UserMembership;
import lombok.Data;

@Data
public class PaymentRequest {
    long packageId;
    long paymentId;
    UserMembership userMembership;
}
