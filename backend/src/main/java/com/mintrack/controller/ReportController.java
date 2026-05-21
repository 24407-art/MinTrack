package com.mintrack.controller;

import com.mintrack.entity.Report;
import com.mintrack.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping
    public List<Report> getAll(@RequestParam(required = false) Integer siteId,
                               @RequestParam(required = false) String type) {
        if (siteId != null) return reportService.findBySiteId(siteId);
        if (type != null) return reportService.findByType(type);
        return reportService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getById(@PathVariable Integer id) {
        return reportService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Report> create(@RequestBody Report report) {
        return ResponseEntity.status(201).body(reportService.save(report));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Report> update(@PathVariable Integer id, @RequestBody Report report) {
        try {
            return ResponseEntity.ok(reportService.update(id, report));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        reportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
