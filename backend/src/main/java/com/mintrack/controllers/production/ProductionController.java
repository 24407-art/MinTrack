package com.mintrack.controllers.production;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.production.Production;
import com.mintrack.service.production.ProductionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/production")
@RequiredArgsConstructor
public class ProductionController {
    private final ProductionService productionService;

    @GetMapping
    public PageResponseDto<Production> getAll(
            @RequestParam(required = false) Integer siteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Production> result;
        if (siteId != null) {
            result = productionService.findBySiteId(siteId, pageable);
        } else {
            result = productionService.findAll(pageable);
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
    public ResponseEntity<Production> getById(@PathVariable Integer id) {
        return productionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Production> create(@RequestBody Production production) {
        return ResponseEntity.status(201).body(productionService.save(production));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Production> update(@PathVariable Integer id, @RequestBody Production production) {
        try {
            return ResponseEntity.ok(productionService.update(id, production));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        productionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
