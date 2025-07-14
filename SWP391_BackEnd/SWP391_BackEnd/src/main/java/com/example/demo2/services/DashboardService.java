package com.example.demo2.services;

import com.example.demo2.dto.DashBoardDTO;
import com.example.demo2.dto.MembershipCountDTO;
import com.example.demo2.dto.NewUserTrendDTO;
import com.example.demo2.entity.User;
import com.example.demo2.repository.UserRepository;
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

    public DashBoardDTO getDashboardStats() {
        DashBoardDTO dto = new DashBoardDTO();

        // 1) Total users
        List<User> users = userRepository.findAll();
        dto.setTotalUser((long) users.size());

        // 2) Total coaches
        long coachCount = users.stream()
                .filter(u -> u.getRole() == 2)
                .count();
        dto.setTotalCoach(coachCount);

        // 3) New users in last 30 days
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -30);
        Date thirtyDaysAgo = cal.getTime();
        long newUsersCount = users.stream()
                .filter(u -> u.getJoinDate() != null && u.getJoinDate().after(thirtyDaysAgo))
                .count();
        dto.setNewUserCount(newUsersCount);

        // 4) Membership plan usage via your service
        List<MembershipCountDTO> stats = reportService.countMembersByPlan();
        Optional<MembershipCountDTO> maxPlan = stats.stream()
                .max(Comparator.comparingLong(MembershipCountDTO::getMemberCount));

        if (maxPlan.isPresent()) {
            MembershipCountDTO best = maxPlan.get();
            dto.setMostUsedMembership(best.getPlanName());
            dto.setMostUsedMembershipCount(best.getMemberCount());
        } else {
            dto.setMostUsedMembership("No data");
            dto.setMostUsedMembershipCount(0L);
        }

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
}
