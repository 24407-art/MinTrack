package com.mintrack.controllers.report;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.report.Report;
import com.mintrack.service.report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping
    public PageResponseDto<Report> getAll(
            @RequestParam(required = false) Integer siteId,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Report> result;
        if (siteId != null) {
            result = reportService.findBySiteId(siteId, pageable);
        } else if (type != null) {
            result = reportService.findByType(type, pageable);
        } else {
            result = reportService.findAll(pageable);
        }

        return new PageResponseDto<>(
                result.getContent(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize()
        );
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
