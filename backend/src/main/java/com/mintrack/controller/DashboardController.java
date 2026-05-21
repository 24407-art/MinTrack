package com.mintrack.controller;

import com.mintrack.entity.*;
import com.mintrack.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final SiteService siteService;
    private final EquipmentService equipmentService;
    private final PersonnelService personnelService;
    private final ReportService reportService;
    private final ProductionService productionService;
    private final ShiftService shiftService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard() {
        List<Site> sites = siteService.findAll();
        List<Equipment> equipment = equipmentService.findAll();
        List<Personnel> personnel = personnelService.findAll();
        List<Report> reports = reportService.findAll();
        List<Production> production = productionService.findAll();
        List<Shift> shifts = shiftService.findAll();

        int activeSites = (int) sites.stream().filter(s -> "active".equals(s.getStatus())).count();
        int totalSites = sites.size();
        int activeEquipment = (int) equipment.stream().filter(e -> "active".equals(e.getStatus()) || "operational".equals(e.getStatus())).count();
        int totalEquipment = equipment.size();
        int activePersonnel = (int) personnel.stream().filter(p -> "active".equals(p.getStatus())).count();
        int openIncidents = (int) reports.stream().filter(r -> "security".equals(r.getType()) && ("open".equals(r.getStatus()) || "investigating".equals(r.getStatus()))).count();

        double dailyProduction = production.stream()
                .filter(p -> p.getDate() != null && p.getDate().toLocalDate().equals(LocalDate.now()))
                .mapToDouble(p -> p.getActual() != null ? p.getActual() : 0)
                .sum();

        List<Map<String, Object>> recentIncidents = reports.stream()
                .filter(r -> "security".equals(r.getType()))
                .sorted(Comparator.comparing(Report::getDate).reversed())
                .limit(5)
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", r.getId());
                    m.put("title", r.getTitle());
                    m.put("status", r.getStatus());
                    m.put("date", r.getDate());
                    m.put("siteName", r.getSite() != null ? r.getSite().getName() : null);
                    return m;
                })
                .toList();

        List<Map<String, Object>> productionChart = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusDays(i);
            final LocalDate target = d;
            double total = production.stream()
                    .filter(p -> p.getDate() != null && p.getDate().toLocalDate().equals(target))
                    .mapToDouble(p -> p.getActual() != null ? p.getActual() : 0)
                    .sum();
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.FRENCH));
            entry.put("tonnes", (int) total);
            productionChart.add(entry);
        }

        List<Map<String, Object>> equipmentStatus = equipment.stream()
                .limit(10)
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("name", e.getName());
                    m.put("type", e.getType());
                    m.put("status", e.getStatus());
                    m.put("model", e.getModel());
                    return m;
                })
                .toList();

        List<Map<String, Object>> shiftsList = shifts.stream().map(s -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName());
            m.put("time", s.getStartTime() + " - " + s.getEndTime());
            m.put("status", s.getStatus());
            m.put("workers", s.getWorkers());
            return m;
        }).toList();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("production", Map.of("daily", (int) dailyProduction, "change", 12.5));
        stats.put("equipment", Map.of("active", activeEquipment, "total", totalEquipment, "change", -2));
        stats.put("personnel", Map.of("total", activePersonnel, "change", 3.2));
        stats.put("incidents", Map.of("open", openIncidents, "change", -25));
        stats.put("sites", Map.of("active", activeSites, "total", totalSites));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("stats", stats);
        result.put("productionChart", productionChart);
        result.put("recentIncidents", recentIncidents);
        result.put("equipmentStatus", equipmentStatus);
        result.put("shifts", shiftsList);

        return ResponseEntity.ok(result);
    }
}
