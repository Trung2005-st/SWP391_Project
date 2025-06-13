package com.example.demo2.api;

import com.example.demo2.entity.User;
import com.example.demo2.exception.AccountNotFoundException;
import com.example.demo2.repository.UserRepository;
import com.example.demo2.services.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@CrossOrigin("*")
@RequestMapping("/api/users")
//cài khóa bằng name api để ko cho truy cập nếu chưa có quyền
@SecurityRequirement(name="api")
@RestController
//dùng localhost:8080/swagger-ui/index.html để setup api dễ
public class UserAPI{

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    List<User> userList= new ArrayList<>();


    @GetMapping
    public ResponseEntity userList(){
        userList = userRepository.findAll();
        return ResponseEntity.ok(userList);
    }

    @PostMapping
    public ResponseEntity createUser(@Valid @RequestBody User user){
        user.setJoinDate(new Date());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/{userId}")
    public ResponseEntity getUserById(@PathVariable long userId){
        return ResponseEntity.ok(userRepository.findById(userId).orElseThrow(
                ()->new AccountNotFoundException("Account not found!")
        ));
    }

    @PutMapping("/{userId}")
    public ResponseEntity updateUser(@PathVariable long userId ,@Valid @RequestBody User user){
        User u= userRepository.findById(userId).orElseThrow(
                ()-> new AccountNotFoundException("Account not found!")
        );
        u.setUsername(user.getUsername());
        u.setEmail(user.getEmail());
        u.setPassword(passwordEncoder.encode(user.getPassword()));
        u.setGender(user.getGender());
        u.setRole(user.getRole());
        u.setIsVerified(user.getIsVerified());
        u.setMembershipPlan(user.getMembershipPlan());
        return ResponseEntity.ok(userRepository.save(u));
    }

    @DeleteMapping
    public ResponseEntity deleteAll(){
        userRepository.deleteAll();
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("{userId}")
    public ResponseEntity deleteUserById(@PathVariable long userId){
        userRepository.deleteById(userId);
        return ResponseEntity.ok(userRepository.findAll());
    }
}
