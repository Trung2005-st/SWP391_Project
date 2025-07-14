// src/main/java/com/example/demo2/service/MembershipReportService.java
package com.example.demo2.service;

import com.example.demo2.dto.MembershipCountDTO;
import com.example.demo2.entity.MembershipPlan;
import com.example.demo2.entity.User;
import com.example.demo2.repository.MembershipPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MembershipReportService {

    @Autowired
    private MembershipPlanRepository planRepo;

    /**
     * Lấy danh sách tất cả plan, rồi đếm số user có role = 1 (Member) trong mỗi plan.
     */
    public List<MembershipCountDTO> countMembersByPlan() {
        List<MembershipPlan> plans = planRepo.findAll();   // load hết plans (và lazily load users khi cần)
        List<MembershipCountDTO> result = new ArrayList<>();

        for (MembershipPlan plan : plans) {
            List<User> users = plan.getUsers();
            long memberCount = 0;
            if (users != null) {
                memberCount = users.stream()
                        .filter(u -> u.getRole() == 1)  // chỉ đếm Member
                        .count();
            }
            result.add(new MembershipCountDTO(plan.getName(), memberCount));
        }

        return result;
    }
}
