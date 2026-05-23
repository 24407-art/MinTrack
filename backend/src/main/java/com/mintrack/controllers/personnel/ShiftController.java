package com.mintrack.controllers.personnel;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.personnel.Shift;
import com.mintrack.service.personnel.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;

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
