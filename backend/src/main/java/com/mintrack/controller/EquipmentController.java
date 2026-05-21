package com.mintrack.controller;

import com.mintrack.entity.Equipment;
import com.mintrack.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipment")
@RequiredArgsConstructor
public class EquipmentController {
    private final EquipmentService equipmentService;

    @GetMapping
    public List<Equipment> getAll(@RequestParam(required = false) Integer siteId) {
        if (siteId != null) return equipmentService.findBySiteId(siteId);
        return equipmentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getById(@PathVariable Integer id) {
        return equipmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Equipment> create(@RequestBody Equipment equipment) {
        return ResponseEntity.status(201).body(equipmentService.save(equipment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> update(@PathVariable Integer id, @RequestBody Equipment equipment) {
        try {
            return ResponseEntity.ok(equipmentService.update(id, equipment));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        equipmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
