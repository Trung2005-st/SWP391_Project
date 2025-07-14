package com.example.demo2.api;

import com.example.demo2.dto.DashBoardDTO;
import com.example.demo2.dto.NewUserTrendDTO;
import com.example.demo2.dto.MembershipCountDTO;
import com.example.demo2.services.DashboardService;
import com.example.demo2.service.MembershipReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class DashboardAPI {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private MembershipReportService reportService;

    // --- 1) Stats ---
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashBoardDTO> stats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // --- 2) New‐users trend (for bar chart) ---
    @GetMapping("/dashboard/new-users-trend")
    public ResponseEntity<List<NewUserTrendDTO>> trend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(dashboardService.getNewUsersTrend(from, to));
    }

    // --- 3) Membership‐by‐plan (for pie chart) ---
    @GetMapping("/reports/members-by-plan")
    public ResponseEntity<List<MembershipCountDTO>> membersByPlan() {
        List<MembershipCountDTO> stats = reportService.countMembersByPlan();
        return ResponseEntity.ok(stats);
    }
}
