package com.example.demo2.services;

import com.example.demo2.dto.ChecklistItem;
import com.example.demo2.entity.DailyCheckList;
import com.example.demo2.entity.DailyReport;
import com.example.demo2.model.request.DailyChecklistRequest;
import com.example.demo2.model.request.DailyReportRequest;
import com.example.demo2.repository.DailyChecklistRepository;
import com.example.demo2.repository.DailyReportRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    @Autowired
    private DailyChecklistRepository checklistRepo;
    @Autowired
    private DailyReportRepository reportRepo;
    @Transactional
    public void saveChecklist(DailyChecklistRequest request) {
        if (request.getChecklist() == null || request.getChecklist().isEmpty()) {
            throw new IllegalArgumentException("Checklist is empty");
        }
        // XÓA TOÀN BỘ checklist hôm đó trước khi thêm lại (đảm bảo không bị chồng thêm mỗi lần submit)
        checklistRepo.deleteAllByUserIdAndDate(Long.valueOf(request.getUserId()), request.getDate());

        for (DailyChecklistRequest.ChecklistItem item : request.getChecklist()) {
            DailyCheckList c = new DailyCheckList();
            c.setUserId(request.getUserId());
            c.setDate(request.getDate());
            c.setItem(item.getText());
            c.setIsChecked(item.getChecked());
            checklistRepo.save(c);
        }
    }
    public List<ChecklistItem> getChecklist(Long userId, LocalDate date) {
        List<DailyCheckList> items = checklistRepo.findAllByUserIdAndDate(userId, date);
        return items.stream()
                .map(c -> new ChecklistItem(c.getItem(), c.getIsChecked()))
                .collect(Collectors.toList());
    }



    public void saveReport(DailyReportRequest request) {
        Long userId = Long.valueOf(request.getUserId());
        LocalDate date = request.getDate();

        // Kiểm tra nếu đã có record cho ngày này
        List<DailyReport> existing = reportRepo.findAllByUserIdAndDate(userId, date);

        DailyReport report;
        if (!existing.isEmpty()) {
            // Ghi đè nếu đã tồn tại
            report = existing.get(0);
        } else {
            report = new DailyReport();
            report.setUserId(Math.toIntExact(userId));
            report.setDate(date);
        }

        // Cập nhật nội dung
        report.setSmokedCigars(request.getSmokedCigars());
        report.setReason(request.getReason());
        report.setFeeling(request.getFeeling());

        reportRepo.save(report);
    }


    public Map<String, Object> getSummary(Integer userId) {
        Integer avoided = reportRepo.getTotalAvoided(userId);
        Integer days = reportRepo.getTotalDays(userId);

        Map<String, Object> map = new HashMap<>();
        map.put("cigarsAvoided", avoided == null ? 0 : avoided);
        map.put("saving", avoided == null ? 0 : avoided * 1); // 1$ mỗi điếu
        map.put("totalDays", days);
        map.put("quittingDays", 30); // giả định
        return map;
    }

    public List<DailyReport> getReportHistory(Integer userId) {
        return reportRepo.findAllByUserId(userId);
    }
    public List<Map<String, Object>> getCigaretteChart(Integer userId) {
        List<Object[]> rows = reportRepo.getCigaretteHistory(userId);
        return rows.stream().map(obj -> {
            Map<String, Object> row = new HashMap<>();
            row.put("date", obj[0]);
            row.put("smokedCigars", obj[1]);
            return row;
        }).collect(Collectors.toList());
    }
    public Optional<DailyReport> getReport(Long userId, LocalDate date) {
        List<DailyReport> results = reportRepo.findAllByUserIdAndDate(userId, date);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

}

