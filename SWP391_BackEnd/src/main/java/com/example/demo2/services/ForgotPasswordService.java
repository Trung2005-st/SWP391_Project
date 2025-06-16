package com.example.demo2.services;

import com.example.demo2.dto.EmailDetail;
import com.example.demo2.entity.User;
import com.example.demo2.model.request.ForgotPasswordRequest;
import com.example.demo2.model.request.ResetPasswordRequest;
import com.example.demo2.repository.AuthenticationRepository;
import javassist.NotFoundException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ForgotPasswordService {
    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    TokenService tokenService;

    @Autowired
    MailSenderService mailSenderService;

    public User getCurrentUser(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return authenticationRepository.findUserByUserID(user.getUserID());
    }

    @SneakyThrows
    public void forgotPassword(ForgotPasswordRequest forgotPasswordRequest){
        User user = authenticationRepository.findUserByEmail(forgotPasswordRequest.getEmail());

        if(user == null){
            throw new NotFoundException("Account Not Found");
        }
        else{
            EmailDetail emailDetail = new EmailDetail();
            emailDetail.setRecipient(user.getEmail());
            emailDetail.setSubject("Reset Password");
            // đẩy cái FE resetPassword vô đây
            emailDetail.setLink("https://your-frontend/reset?token=" + tokenService.generateToken(user));
            mailSenderService.sendMail(emailDetail);

        }
    }
    public User resetPassword(ResetPasswordRequest resetPasswordRequest){
        User user = getCurrentUser();
        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        return authenticationRepository.save(user);
    }
}
