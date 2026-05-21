package com.mintrack.controller;

import com.mintrack.entity.Site;
import com.mintrack.service.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sites")
@RequiredArgsConstructor
public class SiteController {
    private final SiteService siteService;

    @GetMapping
    public List<Site> getAll() {
        return siteService.findAll();
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
}
