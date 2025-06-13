package com.example.demo2.api;

import com.example.demo2.entity.User;
import com.example.demo2.model.AccountResponse;
import com.example.demo2.model.loginRequest;
import com.example.demo2.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@CrossOrigin("*")
@RestController
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authentication;

    @PostMapping("/api/register")
    public ResponseEntity register(@RequestBody User account){
        User acc= authentication.register(account);
        return ResponseEntity.ok(acc);
    }


    @PostMapping("/api/login")
    public ResponseEntity login(@Valid @RequestBody loginRequest account){
        AccountResponse acc= authentication.login(account);
        return ResponseEntity.ok(acc);
    }

}
