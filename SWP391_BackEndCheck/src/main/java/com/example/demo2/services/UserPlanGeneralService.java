package com.example.demo2.services;

import com.example.demo2.entity.UserPlanGeneral;
import com.example.demo2.model.request.SaveGeneralRequest;
import com.example.demo2.repository.UserPlanGeneralRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserPlanGeneralService {
    @Autowired
    private UserPlanGeneralRepository repo;

    @Transactional
    public void save(SaveGeneralRequest rq) {
        UserPlanGeneral g = repo.findById(rq.getUserId())
                .orElseGet(() -> {
                    UserPlanGeneral x = new UserPlanGeneral();
                    x.setUserId(rq.getUserId());
                    return x;
                });
        g.setQuitDate(rq.getQuitDate());
        g.setFinishTimeline(rq.getFinishTimeline());
        repo.save(g);
    }
    @Transactional
    public void deleteByUserId(Long userId) {
        repo.deleteById(userId);
    }
    @Transactional(Transactional.TxType.SUPPORTS)
    public Optional<UserPlanGeneral> findByUserId(Long userId) {
        return repo.findById(userId);
    }
}
