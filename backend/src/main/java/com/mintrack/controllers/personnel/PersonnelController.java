package com.mintrack.controllers.personnel;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.personnel.Personnel;
import com.mintrack.service.personnel.PersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/personnel")
@RequiredArgsConstructor
public class PersonnelController {
    private final PersonnelService personnelService;

    @GetMapping
    public PageResponseDto<Personnel> getAll(
            @RequestParam(required = false) Integer siteId,
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Personnel> result;
        if (siteId != null) {
            result = personnelService.findBySiteId(siteId, pageable);
        } else if (teamId != null) {
            result = personnelService.findByTeamId(teamId, pageable);
        } else if (department != null) {
            result = personnelService.findByDepartment(department, pageable);
        } else {
            result = personnelService.findAll(pageable);
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
    public ResponseEntity<Personnel> getById(@PathVariable Integer id) {
        return personnelService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Personnel> create(@RequestBody Personnel personnel) {
        return ResponseEntity.status(201).body(personnelService.save(personnel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personnel> update(@PathVariable Integer id, @RequestBody Personnel personnel) {
        try {
            return ResponseEntity.ok(personnelService.update(id, personnel));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        personnelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
