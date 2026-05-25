package com.mintrack.controllers.personnel;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.audit.AuditLog;
import com.mintrack.entities.personnel.Shift;
import com.mintrack.service.audit.AuditLogService;
import com.mintrack.service.personnel.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;
    private final AuditLogService auditLogService;

    @GetMapping
    public PageResponseDto<Shift> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Shift> result = shiftService.findAll(pageable);
        return new PageResponseDto<>(
                result.getContent(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getById(@PathVariable Integer id) {
        return shiftService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shift> create(@RequestBody Shift shift) {
        Shift saved = shiftService.save(shift);
        auditLogService.logEntity(saved.getId(), "shift", "CREATE", "name", null, saved.getName(), "system");
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> update(@PathVariable Integer id, @RequestBody Shift shift) {
        try {
            Shift updated = shiftService.update(id, shift);
            auditLogService.logEntity(id, "shift", "UPDATE", "name", null, updated.getName(), "system");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        auditLogService.logEntity(id, "shift", "DELETE", "name", "supprimé", null, "system");
        shiftService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<AuditLog>> getHistory(@PathVariable Integer id) {
        return ResponseEntity.ok(auditLogService.findByEntity(id, "shift"));
    }
}
