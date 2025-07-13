package com.example.demo2.services;

import com.example.demo2.entity.MembershipPlan;
import com.example.demo2.entity.Payment;
import com.example.demo2.entity.UserMembership;
import com.example.demo2.enums.PaymentStatus;
import com.example.demo2.exception.NotFoundException;
import com.example.demo2.model.request.MembershipPlanRequest;
import com.example.demo2.repository.MembershipPlanRepository;
import com.example.demo2.repository.PaymentRepository;
import com.example.demo2.repository.UserMembershipRepository;
import com.example.demo2.utils.AccountUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MembershipPlanService {
    @Autowired
    PaymentService paymentService;

    @Autowired
    MembershipPlanRepository membershipPlanRespository;

    @Autowired
    AccountUtils accountUtils;

    @Autowired
    UserMembershipRepository userMembershipRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public MembershipPlan create(MembershipPlanRequest membershipPlanRequest) {
        MembershipPlan membershipPlan = new MembershipPlan();
        membershipPlan.setName(membershipPlanRequest.getName());
        membershipPlan.setDescription(membershipPlanRequest.getDescription());
        membershipPlan.setPrice(membershipPlanRequest.getPrice());
        membershipPlan.setDuration(membershipPlanRequest.getDuration());

        //UserMembership
        UserMembership userMembership = new UserMembership();
        userMembership.setStartDate(LocalDate.now());
        userMembership.setEndDate(LocalDate.now().plusDays(membershipPlanRequest.getDuration()));
        userMembership.setUser(accountUtils.getCurrentAccount());
        userMembership.setMembershipPlan(membershipPlan);
        userMembershipRepository.save(userMembership);

        return membershipPlanRespository.save(membershipPlan);
    }

    public List<MembershipPlan> getAll() {
        return membershipPlanRespository.findByActiveTrue();
    }
    public void cancel(long id) {
        MembershipPlan membershipPlan = membershipPlanRespository.findById(id)
                .orElseThrow(() -> new NotFoundException("Membership Plan Not Found"));
        membershipPlan.setActive(false);
        membershipPlanRespository.save(membershipPlan);
    }

    public String buyMembershipPlan(long planId, String clientId) {
        MembershipPlan membershipPlan = membershipPlanRespository.findById(planId)
                .orElseThrow(() -> new NotFoundException("Membership Plan Not Found"));

        //Payment
        Payment payment = new Payment();
        payment.setStatus(PaymentStatus.CREATED);
        payment.setCreateAt(LocalDateTime.now());
        payment.setAmount(membershipPlan.getPrice());
        paymentRepository.save(payment);
        try{
            return paymentService.createVNPayUrl(String.valueOf(planId),(long) payment.getAmount(), clientId);

        }catch(Exception e){
            throw new NotFoundException("Payment Not Found");
        }
    }


}
