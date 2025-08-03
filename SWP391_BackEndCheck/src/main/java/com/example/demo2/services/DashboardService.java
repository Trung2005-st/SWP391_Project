package com.example.demo2.services;

import com.example.demo2.dto.DashBoardDTO;
import com.example.demo2.dto.MembershipCountDTO;
import com.example.demo2.dto.NewUserTrendDTO;
import com.example.demo2.entity.*;
import com.example.demo2.repository.*;
import com.example.demo2.service.MembershipReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipReportService reportService;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private QuitPlanRepository quitPlanRepository;

    @Autowired
    private UserPlanStatsRepository userPlanStatsRepository;
    @Autowired
    private BlogReportRepository blogReportRepository;


    public DashBoardDTO getDashboardStats() {
        DashBoardDTO dto = new DashBoardDTO();

        // 1. Total users
        List<User> users = userRepository.findAll();
        dto.setTotalUser(users.size());

        // 2. Total coaches
        long coachCount = users.stream().filter(u -> u.getRole() == 2).count();
        dto.setTotalCoach(coachCount);

        // 3. New users in last 30 days
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -30);
        Date thirtyDaysAgo = cal.getTime();
        long newUsersCount = users.stream()
                .filter(u -> u.getJoinDate() != null && u.getJoinDate().after(thirtyDaysAgo))
                .count();
        dto.setNewUserCount(newUsersCount);

        // 4. Total plans
        dto.setTotalPlan(quitPlanRepository.count());

        // 5. Điểm đánh giá trung bình từ emoji
        Double avgEmojiScore = feedbackRepository.getAverageEmojiScore();
        dto.setAverageRating(avgEmojiScore != null ? avgEmojiScore : 0.0);

        // 6. Total money saved (calculated from QuitPlan + UserPlanStats)
        Double saved = quitPlanRepository.calculateTotalMoneySaved();
        dto.setTotalMoneySaved(saved != null ? saved : 0.0);

        return dto;
    }


    public List<NewUserTrendDTO> getNewUsersTrend(LocalDate from, LocalDate to) {
        // load all users, then filter + group by joinDate
        List<User> all = userRepository.findAll();
        // map joinDate (java.util.Date) → LocalDate
        Map<LocalDate, Long> counts = all.stream()
                .filter(u -> u.getJoinDate() != null)
                .map(u -> u.getJoinDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate())
                .filter(d -> !d.isBefore(from) && !d.isAfter(to))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        // build a list for every day in the range, even if zero
        List<NewUserTrendDTO> result = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            long c = counts.getOrDefault(d, 0L);
            result.add(new NewUserTrendDTO(d.toString(), c));
        }
        return result;
    }
    public List<NewUserTrendDTO> getPlanTrend(LocalDate from, LocalDate to) {
        List<UserPlanStats> stats = userPlanStatsRepository.findAll();

        // Nhóm theo ngày updatedAt
        Map<LocalDate, Long> counts = stats.stream()
                .filter(s -> s.getUpdatedAt() != null)
                .map(s -> s.getUpdatedAt().toLocalDate())
                .filter(d -> !d.isBefore(from) && !d.isAfter(to))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<NewUserTrendDTO> result = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            long count = counts.getOrDefault(d, 0L);
            result.add(new NewUserTrendDTO(d.toString(), count));
        }
        return result;
    }
    public List<NewUserTrendDTO> getMoneySavedTrend(LocalDate from, LocalDate to) {
        List<UserPlanStats> stats = userPlanStatsRepository.findAll();

        // Lọc theo mốc thời gian updatedAt
        Map<LocalDate, List<UserPlanStats>> groupedByDate = stats.stream()
                .filter(s -> s.getUpdatedAt() != null)
                .filter(s -> {
                    LocalDate date = s.getUpdatedAt().toLocalDate();
                    return !date.isBefore(from) && !date.isAfter(to);
                })
                .collect(Collectors.groupingBy(s -> s.getUpdatedAt().toLocalDate()));

        List<NewUserTrendDTO> result = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            List<UserPlanStats> dayStats = groupedByDate.getOrDefault(d, new ArrayList<>());

            double totalPackCost = dayStats.stream()
                    .filter(s -> s.getPackCost() != null)
                    .mapToDouble(UserPlanStats::getPackCost)
                    .sum();

            int totalCigarettesPerPack = dayStats.stream()
                    .filter(s -> s.getCigarettesPerPack() != null)
                    .mapToInt(UserPlanStats::getCigarettesPerPack)
                    .sum();

            int totalCigsPerDay = dayStats.stream()
                    .filter(s -> s.getCigarettesPerDay() != null)
                    .mapToInt(UserPlanStats::getCigarettesPerDay)
                    .sum();

            double moneyPerCig = totalCigarettesPerPack == 0 ? 0.0 : totalPackCost / totalCigarettesPerPack;
            double saved = totalPackCost - (moneyPerCig * totalCigsPerDay);

            result.add(new NewUserTrendDTO(d.toString(), Math.round(saved)));
        }

        return result;
    }

    public List<NewUserTrendDTO> getAverageRatingTrend(LocalDate from, LocalDate to) {
        List<Feedback> feedbackList = feedbackRepository.findAll();

        Map<LocalDate, List<Integer>> grouped = feedbackList.stream()
                .filter(f -> f.getSentAt() != null)
                .filter(f -> {
                    try {
                        int val = Integer.parseInt(f.getEmoji());
                        return val >= 1 && val <= 5;
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .map(f -> new AbstractMap.SimpleEntry<>(
                        f.getSentAt().toLocalDate(),
                        Integer.parseInt(f.getEmoji())
                ))
                .filter(e -> !e.getKey().isBefore(from) && !e.getKey().isAfter(to))
                .collect(Collectors.groupingBy(
                        Map.Entry::getKey,
                        Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                ));

        List<NewUserTrendDTO> result = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            List<Integer> ratings = grouped.getOrDefault(d, new ArrayList<>());
            double avg = ratings.isEmpty() ? 0 : ratings.stream().mapToInt(i -> i).average().orElse(0);
            result.add(new NewUserTrendDTO(d.toString(), Math.round(avg)));
        }
        return result;
    }


}
