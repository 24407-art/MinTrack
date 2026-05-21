package com.mintrack.controller;

import com.mintrack.entity.Shift;
import com.mintrack.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;

    @GetMapping
    public List<Shift> getAll() {
        return shiftService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getById(@PathVariable Integer id) {
        return shiftService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shift> create(@RequestBody Shift shift) {
        return ResponseEntity.status(201).body(shiftService.save(shift));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> update(@PathVariable Integer id, @RequestBody Shift shift) {
        try {
            return ResponseEntity.ok(shiftService.update(id, shift));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        shiftService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
