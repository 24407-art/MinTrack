package com.mintrack.controller;

import com.mintrack.entity.Production;
import com.mintrack.service.ProductionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/production")
@RequiredArgsConstructor
public class ProductionController {
    private final ProductionService productionService;

    @GetMapping
    public List<Production> getAll(@RequestParam(required = false) Integer siteId) {
        if (siteId != null) return productionService.findBySiteId(siteId);
        return productionService.findAll();
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
