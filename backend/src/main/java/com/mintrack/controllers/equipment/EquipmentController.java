package com.mintrack.controllers.equipment;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.equipment.Equipment;
import com.mintrack.service.equipment.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/equipment")
@RequiredArgsConstructor
public class EquipmentController {
    private final EquipmentService equipmentService;

    @GetMapping
    public PageResponseDto<Equipment> getAll(
            @RequestParam(required = false) Integer siteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Equipment> result;
        if (siteId != null) {
            result = equipmentService.findBySiteId(siteId, pageable);
        } else {
            result = equipmentService.findAll(pageable);
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
