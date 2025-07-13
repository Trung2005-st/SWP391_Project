package com.example.demo2.api;

import com.example.demo2.entity.MembershipPlan;
import com.example.demo2.exception.MembershipPlanNotFoundException;
import com.example.demo2.repository.MembershipPlanRepository;
import com.example.demo2.services.MembershipPlanService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RequestMapping("/api/membership")
@RestController
@SecurityRequirement(name = "api")
public class MembershipAPI {
    @Autowired
    MembershipPlanRepository membershipPlanRespository;

    @Autowired
    MembershipPlanService membershipPlanService;


    @GetMapping
    public ResponseEntity getAllMembershipPlans() {
        return ResponseEntity.ok(membershipPlanService.getAll());
    }

    @GetMapping("/{planID}")
    public ResponseEntity getMembershipPlanById(@PathVariable long planID) {
        return ResponseEntity.ok(membershipPlanRespository.findById(planID)
                .orElseThrow(() -> new MembershipPlanNotFoundException("Membership Plan Not Found")));
    }

    @PostMapping
    public ResponseEntity addMembershipPlan(@Valid @RequestBody MembershipPlan membershipPlan){
        return ResponseEntity.ok(membershipPlanRespository.save(membershipPlan));
    }

    @PutMapping("/{planID}")
    public ResponseEntity updateMembershipPlan(@PathVariable long planID,@Valid @RequestBody MembershipPlan membershipPlan){
        MembershipPlan membershipPlanEdit = membershipPlanRespository
                .findById(planID)
                .orElseThrow((() -> new MembershipPlanNotFoundException("Not found membershipplan")));
        membershipPlanEdit.setQuitPlans(membershipPlan.getQuitPlans());
        membershipPlanEdit.setUserPlanHistories(membershipPlan.getUserPlanHistories());
        membershipPlanEdit.setUsers(membershipPlan.getUsers());
        membershipPlanEdit.setName(membershipPlan.getName());
        membershipPlanEdit.setDuration(membershipPlan.getDuration());
        membershipPlanEdit.setPrice(membershipPlan.getPrice());
        membershipPlanEdit.setDescription(membershipPlan.getDescription());
        return ResponseEntity.ok(membershipPlanRespository.save(membershipPlanEdit));
    }

    @DeleteMapping("/{planID}")
    public ResponseEntity deleteMembershipPlan(@PathVariable Long planID){
        membershipPlanService.cancel(planID);
        return ResponseEntity.ok("Successfully cancelled membership plan");
    }

    @PostMapping("/buy/{planID}")
    public ResponseEntity buyMembershipPlan(@PathVariable Long planID, HttpServletRequest request){
        String clientIP = request.getHeader("X-Forwarded-For");
        if(clientIP == null || clientIP.isEmpty()){
            clientIP = request.getRemoteAddr();
        }
        String URL = membershipPlanService.buyMembershipPlan(planID, clientIP);
        return ResponseEntity.ok().body(URL);
    }

}
