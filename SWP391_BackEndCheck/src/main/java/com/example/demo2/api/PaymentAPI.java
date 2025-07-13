package com.example.demo2.api;


import com.example.demo2.model.request.PaymentRequest;
import com.example.demo2.services.PaymentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/payment")
@CrossOrigin("*")
@SecurityRequirement(name = "api")
public class PaymentAPI {
    @Autowired
    PaymentService paymentService;
    @PostMapping
    public ResponseEntity createPayment(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.setStatus(paymentRequest));
    }
}
