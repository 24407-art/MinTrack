package com.mintrack.controllers.dashboard;

import com.mintrack.entities.equipment.Equipment;
import com.mintrack.entities.personnel.Personnel;
import com.mintrack.entities.personnel.Shift;
import com.mintrack.entities.production.Production;
import com.mintrack.entities.report.Report;
import com.mintrack.entities.site.Site;
import com.mintrack.service.equipment.EquipmentService;
import com.mintrack.service.personnel.PersonnelService;
import com.mintrack.service.personnel.ShiftService;
import com.mintrack.service.production.ProductionService;
import com.mintrack.service.report.ReportService;
import com.mintrack.service.site.SiteService;
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
        long totalSites = siteService.count();
        long activeSites = siteService.countByStatus("active");
        long totalEquipment = equipmentService.count();
        long activeEquipment = equipmentService.countByStatus("active") + equipmentService.countByStatus("operational");
        long activePersonnel = personnelService.countByStatus("active");
        long openIncidents = reportService.countByTypeAndStatus("security", "open")
                           + reportService.countByTypeAndStatus("security", "investigating");

        double dailyProduction = productionService.sumActualByDate(LocalDate.now());

        List<Map<String, Object>> recentIncidents = reportService.findTop5ByTypeOrderByDateDesc("security")
                .stream()
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
            double total = productionService.sumActualByDate(d);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.FRENCH));
            entry.put("tonnes", (int) total);
            productionChart.add(entry);
        }

        List<Map<String, Object>> equipmentStatus = equipmentService.findTop10()
                .stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("name", e.getName());
                    m.put("type", e.getType());
                    m.put("status", e.getStatus());
                    m.put("model", e.getModel());
                    return m;
                })
                .toList();

        List<Map<String, Object>> shiftsList = shiftService.findAllActive()
                .stream()
                .map(s -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", s.getId());
                    m.put("name", s.getName());
                    m.put("time", s.getStartTime() + " - " + s.getEndTime());
                    m.put("status", s.getStatus());
                    m.put("workers", s.getWorkers());
                    return m;
                })
                .toList();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("production", Map.of("daily", (int) dailyProduction, "change", 12.5));
        stats.put("equipment", Map.of("active", (int) activeEquipment, "total", (int) totalEquipment, "change", -2));
        stats.put("personnel", Map.of("total", (int) activePersonnel, "change", 3.2));
        stats.put("incidents", Map.of("open", (int) openIncidents, "change", -25));
        stats.put("sites", Map.of("active", (int) activeSites, "total", (int) totalSites));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("stats", stats);
        result.put("productionChart", productionChart);
        result.put("recentIncidents", recentIncidents);
        result.put("equipmentStatus", equipmentStatus);
        result.put("shifts", shiftsList);

        return ResponseEntity.ok(result);
    }
}
