package com.example.demo2.api;

import com.example.demo2.dto.ChecklistItem;
import com.example.demo2.entity.DailyReport;
import com.example.demo2.model.request.DailyChecklistRequest;
import com.example.demo2.model.request.DailyReportRequest;
import com.example.demo2.services.ProgressService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@SecurityRequirement(name="api")
@CrossOrigin(origins = "*")
public class ProgressAPI {
    @Autowired
    private ProgressService progressService;

    @PostMapping("/daily-checklist")
    public ResponseEntity<String> saveChecklist(@RequestBody DailyChecklistRequest request) {
        progressService.saveChecklist(request);
        return ResponseEntity.ok("Checklist saved");
    }

    @PostMapping("/daily-report")
    public ResponseEntity<String> saveReport(@RequestBody DailyReportRequest request) {
        progressService.saveReport(request);
        return ResponseEntity.ok("Report saved");
    }
    @GetMapping("/daily-checklist")
    public ResponseEntity<List<ChecklistItem>> getChecklist(@RequestParam Long userId, @RequestParam String date) {
        return ResponseEntity.ok(progressService.getChecklist(userId, LocalDate.parse(date)));
    }

    @GetMapping("/daily-report")
    public ResponseEntity<DailyReport> getReport(@RequestParam("userId") String userIdStr, @RequestParam("date") String dateStr) {
        Long userId = Long.parseLong(userIdStr);
        LocalDate date = LocalDate.parse(dateStr);
        return ResponseEntity.ok(progressService.getReport(userId, date).orElse(null));
    }


    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestParam Integer userId) {
        return ResponseEntity.ok(progressService.getSummary(userId));
    }

    @GetMapping("/report-history")
    public ResponseEntity<List<DailyReport>> getHistory(@RequestParam Integer userId) {
        return ResponseEntity.ok(progressService.getReportHistory(userId));
    }

    @GetMapping("/cigarette-history")
    public ResponseEntity<List<Map<String, Object>>> getCigaretteChart(@RequestParam Integer userId) {
        return ResponseEntity.ok(progressService.getCigaretteChart(userId));
    }
}
