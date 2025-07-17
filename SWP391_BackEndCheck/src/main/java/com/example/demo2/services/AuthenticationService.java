package com.example.demo2.services;

import com.example.demo2.dto.EmailDetail;
import com.example.demo2.entity.User;
import com.example.demo2.enums.OtpPurpose;
import com.example.demo2.exception.AuthenticationException;
import com.example.demo2.exception.BadRequestException;
import com.example.demo2.model.request.VerifyEmailRequest;
import com.example.demo2.model.request.registerRequest;
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
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
//extend cho quyền user
public class AuthenticationService implements UserDetailsService {


    private final Map<String, User> pendingUsers = new ConcurrentHashMap<>();

    private final Map<String, Long> lastSent = new ConcurrentHashMap<>();
    private static final long COOLDOWN_MS = 60_000;          // 60 s giữa 2 lần gửi

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

    @Autowired
    OTPService otpService;

    @Autowired
    MailSenderService mailSenderService;

    public void register(registerRequest req) {
        if(authenticationRepository.existsByEmail(req.getEmail())) {
            throw new AuthenticationException("Email already in use");
        }else if(authenticationRepository.existsByUsername(req.getUsername())) {
            throw new AuthenticationException("Username already in use");
        }
        User user = modelMapper.map(req, User.class);
        pendingUsers.put(req.getEmail(), user);

        EmailDetail email = new EmailDetail();
        email.setRecipient(req.getEmail());
        email.setSubject("Verify your email to complete registration");
        otpService.sendOTPEmail(email, OtpPurpose.VERIFY_EMAIL);
    }

    public User getPendingUser(String email) {
        return pendingUsers.get(email);
    }



    public User confirmRegistration(VerifyEmailRequest verifyEmailRequest) {
        // ✅ Validate email + OTP input early
        if (verifyEmailRequest.getEmail() == null || verifyEmailRequest.getEmail().isBlank()
                || verifyEmailRequest.getOtp() == null || verifyEmailRequest.getOtp().isBlank()) {
            throw new BadRequestException("Email and OTP must not be empty.");
        }

        // ✅ Check if OTP is valid
        boolean valid = otpService.verifyOTP(
                verifyEmailRequest.getEmail(),
                verifyEmailRequest.getOtp(),
                OtpPurpose.VERIFY_EMAIL
        );

        if (!valid) {
            throw new BadRequestException("Invalid or expired OTP.");
        }

        // ✅ Get pending user from in-memory store
        User user = pendingUsers.remove(verifyEmailRequest.getEmail());

        if (user == null) {
            throw new BadRequestException("No pending registration found for this email. Please register again.");
        }

        // ✅ Finalize user data
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setJoinDate(new Date());
        user.setVerified(true);
        user.setRole(1);  // 1 = standard member, adjust as needed

        // ✅ Optional: send welcome email
        EmailDetail welcome = new EmailDetail();
        welcome.setRecipient(user.getEmail());
        welcome.setSubject("Welcome to our platform!");
        welcome.setLink(""); // You can include a login or dashboard link if needed
        mailSenderService.sendMail(welcome);

        // ✅ Save to database
        return authenticationRepository.save(user);
    }


    public void resendOtp(String email) {
        User pending = pendingUsers.get(email);
        if (pending == null) {
            throw new BadRequestException("No pending registration for this email");
        }

        long now = System.currentTimeMillis();
        Long last = lastSent.getOrDefault(email, 0L);
        if (now - last < COOLDOWN_MS) {
            throw new BadRequestException("Please wait before requesting new OTP");
        }

        EmailDetail mail = new EmailDetail();
        mail.setRecipient(email);
        mail.setSubject("Resend verification OTP");
        otpService.sendOTPEmail(mail, OtpPurpose.VERIFY_EMAIL);

        lastSent.put(email, now);          // cập nhật thời gian gửi gần nhất
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
        if (!account.isStatus()){
            throw new AuthenticationException("Account is locked! Contact admin to unlock");
        }
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
