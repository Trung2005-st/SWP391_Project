package com.example.demo2.services;

import com.example.demo2.entity.UserPlanStats;
import com.example.demo2.model.request.SaveStatsRequest;
import com.example.demo2.repository.UserPlanStatsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPlanStatsService {
    @Autowired
    private UserPlanStatsRepository repo;

    @Transactional
    public void save(SaveStatsRequest rq) {
        UserPlanStats s = repo.findById(rq.getUserId())
                .orElseGet(() -> {
                    UserPlanStats x = new UserPlanStats();
                    x.setUserId(rq.getUserId());
                    return x;
                });
        s.setCigarettesPerDay(rq.getCigarettesPerDay());
        s.setCigarettesPerPack(rq.getCigarettesPerPack());
        s.setPackCost(rq.getPackCost());
        repo.save(s);
    }
}
