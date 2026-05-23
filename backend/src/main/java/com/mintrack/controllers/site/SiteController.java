package com.mintrack.controllers.site;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.audit.AuditLog;
import com.mintrack.entities.site.Site;
import com.mintrack.service.audit.AuditLogService;
import com.mintrack.service.site.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sites")
@RequiredArgsConstructor
public class SiteController {
    private final SiteService siteService;
    private final AuditLogService auditLogService;

    @GetMapping("/all")
    public ResponseEntity<List<Site>> getAllUnpaged() {
        return ResponseEntity.ok(siteService.findAll());
    }

    @GetMapping
    public PageResponseDto<Site> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Site> result = siteService.findAll(pageable);
        return new PageResponseDto<>(
                result.getContent(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Site> getById(@PathVariable Integer id) {
        return siteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Site> create(@RequestBody Site site) {
        return ResponseEntity.status(201).body(siteService.save(site));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Site> update(@PathVariable Integer id, @RequestBody Site site) {
        try {
            return ResponseEntity.ok(siteService.update(id, site));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        siteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<AuditLog>> getHistory(@PathVariable Integer id) {
        return ResponseEntity.ok(auditLogService.findBySiteId(id));
    }
}
