package com.example.demo2.api;

import com.example.demo2.entity.QuitPlan;
import com.example.demo2.exception.QuitPlanNotFoundException;
import com.example.demo2.repository.QuitPlanRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@CrossOrigin("*")
@RestController
@Data
@RequestMapping("/api/quitPlan")
public class QuitPlanAPI {

    @Autowired
    QuitPlanRepository quitPlanRepository;

    @GetMapping
    public ResponseEntity getAllQuitPlan() {
        return ResponseEntity.ok(quitPlanRepository.findAll());
    }

    @GetMapping("/{quitID}")
    public ResponseEntity getQuitPlanById(@PathVariable long quitID) {
        return ResponseEntity.ok(quitPlanRepository.findById(quitID)
                .orElseThrow(() -> new QuitPlanNotFoundException("Not found quit plan!")));
    }

    @PostMapping
    public ResponseEntity createQuitPlan(@RequestBody QuitPlan quitPlan) {
        quitPlan.setStartDate(new Date());
        return ResponseEntity.ok(quitPlanRepository.save(quitPlan));
    }

    @PutMapping("/{quitID}")
    public ResponseEntity editQuitPlan(@PathVariable long quitID, @RequestBody QuitPlan quitPlan) {
        QuitPlan quitPlanEdit= quitPlanRepository.findById(quitID)
                .orElseThrow(() -> new QuitPlanNotFoundException("Not found quit plan!"));
        quitPlanEdit.setStartDate(new Date());
        quitPlanEdit.setEndDate(new Date());
        quitPlanEdit.setReason(quitPlan.getReason());
        quitPlanEdit.setStage(quitPlan.getStage());
        return ResponseEntity.ok(quitPlanRepository.save(quitPlanEdit));
    }

    @DeleteMapping("/{quitID}")
    public ResponseEntity deleteQuitPlan(@PathVariable long quitID) {
        quitPlanRepository.deleteById(quitID);
        return ResponseEntity.ok().build();
    }
}
