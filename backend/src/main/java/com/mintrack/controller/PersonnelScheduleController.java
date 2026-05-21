package com.mintrack.controller;

import com.mintrack.entity.PersonnelSchedule;
import com.mintrack.service.PersonnelScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/personnel/schedule")
@RequiredArgsConstructor
public class PersonnelScheduleController {
    private final PersonnelScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) Integer personnelId,
                                    @RequestParam(required = false) String weekStart) {
        if (personnelId != null && weekStart != null) {
            LocalDateTime ws = LocalDateTime.parse(weekStart + "T00:00:00");
            return scheduleService.findByPersonnelIdAndWeekStart(personnelId, ws)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.ok(new PersonnelSchedule()));
        }
        if (personnelId != null) {
            List<PersonnelSchedule> list = scheduleService.findByPersonnelId(personnelId);
            return ResponseEntity.ok(list.isEmpty() ? List.of() : list);
        }
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<PersonnelSchedule> create(@RequestBody PersonnelSchedule schedule) {
        return ResponseEntity.status(201).body(scheduleService.save(schedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonnelSchedule> update(@PathVariable Integer id, @RequestBody PersonnelSchedule schedule) {
        try {
            return ResponseEntity.ok(scheduleService.update(id, schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
