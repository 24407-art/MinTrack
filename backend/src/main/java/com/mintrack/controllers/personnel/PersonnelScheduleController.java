package com.mintrack.controllers.personnel;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.personnel.PersonnelSchedule;
import com.mintrack.service.personnel.PersonnelScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/personnel/schedule")
@RequiredArgsConstructor
public class PersonnelScheduleController {
    private final PersonnelScheduleService scheduleService;

    @GetMapping
    public PageResponseDto<PersonnelSchedule> getAll(
            @RequestParam(required = false) Integer personnelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PersonnelSchedule> result;
        if (personnelId != null) {
            result = scheduleService.findByPersonnelId(personnelId, pageable);
        } else {
            result = scheduleService.findAll(pageable);
        }

        return new PageResponseDto<>(
                result.getContent(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize()
        );
    }

    @GetMapping("/by-week")
    public ResponseEntity<?> getByPersonnelAndWeek(@RequestParam Integer personnelId,
                                                   @RequestParam String weekStart) {
        LocalDateTime ws = LocalDateTime.parse(weekStart + "T00:00:00");
        return scheduleService.findByPersonnelIdAndWeekStart(personnelId, ws)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(new PersonnelSchedule()));
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
