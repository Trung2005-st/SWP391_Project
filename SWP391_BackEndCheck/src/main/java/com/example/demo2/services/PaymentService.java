package com.example.demo2.services;


import com.example.demo2.entity.MembershipPlan;
import com.example.demo2.entity.Payment;
import com.example.demo2.entity.User;
import com.example.demo2.entity.UserMembership;
import com.example.demo2.exception.NotFoundException;
import com.example.demo2.model.request.PaymentRequest;
import com.example.demo2.repository.MembershipPlanRepository;
import com.example.demo2.repository.PaymentRepository;
import com.example.demo2.repository.UserMembershipRepository;
import com.example.demo2.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

@Service
public class PaymentService {
    @Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @Value("${vnpay.payUrl}")
    private String vnp_PayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnp_Returnurl;

    @Autowired
    AccountUtils accountUtils;


    @Autowired
    UserMembershipRepository userMembershipRepository;

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private MembershipPlanRepository membershipPlanRepository;


    public String createVNPayUrl(String packageId, long amount, String clientIp)
            throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String createDate = LocalDateTime.now().format(formatter);
        String orderIdVnPay = UUID.randomUUID().toString().substring(0, 8);

        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnp_TmnCode);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", orderIdVnPay);
        vnpParams.put("vnp_OrderInfo", "Thanh toán cho mã GD: " + packageId);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100)); // đúng định dạng: nhân 100
        vnpParams.put("vnp_ReturnUrl", vnp_Returnurl + "?packageID=" + packageId);
        vnpParams.put("vnp_CreateDate", createDate);
        vnpParams.put("vnp_IpAddr", clientIp);

        // Build data to hash
        StringBuilder signDataBuilder = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            signDataBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("=");
            signDataBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            signDataBuilder.append("&");
        }
        signDataBuilder.deleteCharAt(signDataBuilder.length() - 1); // Remove last '&'

        String signData = signDataBuilder.toString();
        String signed = generateHMAC(vnp_HashSecret, signData);
        vnpParams.put("vnp_SecureHash", signed);

        // Build payment URL
        StringBuilder urlBuilder = new StringBuilder(vnp_PayUrl).append("?");
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            urlBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("=");
            urlBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
            urlBuilder.append("&");
        }
        urlBuilder.deleteCharAt(urlBuilder.length() - 1); // Remove last '&'

        return urlBuilder.toString();
    }
    private String generateHMAC(String secretKey, String signData)
            throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmacSha512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSha512.init(keySpec);
        byte[] hmacBytes = hmacSha512.doFinal(signData.getBytes(StandardCharsets.UTF_8));

        StringBuilder result = new StringBuilder();
        for (byte b : hmacBytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    public Payment setStatus(PaymentRequest request){
        MembershipPlan membershipPackage = membershipPlanRepository.findById(request.getPackageId())
                .orElseThrow(() -> new NotFoundException("Ko thim thay goi thanh vien"));
        Payment payment =  paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new NotFoundException("Ko tim thay payment"));
        User currentUser = accountUtils.getCurrentAccount();
        UserMembership userMemberShip = new UserMembership();
        userMemberShip.setUser(currentUser);
        userMemberShip.setStartDate(LocalDate.now());
        userMemberShip.setEndDate(LocalDate.now().plusDays(membershipPackage.getDuration()));
        userMembershipRepository.save(userMemberShip);
        userMemberShip.setMembershipPlan(membershipPackage);
        payment.setUserMembership(userMemberShip);
        return paymentRepository.save(payment);
    }
}
