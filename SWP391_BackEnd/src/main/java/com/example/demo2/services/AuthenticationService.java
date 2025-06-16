package com.example.demo2.services;

import com.example.demo2.entity.User;
import com.example.demo2.exception.AuthenticationException;
import com.example.demo2.model.response.AccountResponse;
import com.example.demo2.model.request.loginRequest;
import com.example.demo2.repository.AuthenticationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
//extend cho quyền user
public class AuthenticationService implements UserDetailsService {


    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TokenService tokenService;

    public User register(User account){
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        account.setJoinDate(new Date());
        account.setRole(1);
        User acc= authenticationRepository.save(account);
        return acc;
    }

    public AccountResponse login(loginRequest accountLogin){
        //methods này sẽ yêu cầu sql kiểm tra dùm có khớp với nội dung login không và trả kết quả
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    accountLogin.getUsername(),
                    accountLogin.getPassword()
            ));
        }catch(Exception e){
            //sai thông tin login
            throw new AuthenticationException("Authentication Failed!!!");
        }
        User account= authenticationRepository.findUserByUsername(accountLogin.getUsername());
        AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
        String token = tokenService.generateToken(account);
        accountResponse.setToken(token);
        return accountResponse;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authenticationRepository.findUserByUsername(username);
    }
}
