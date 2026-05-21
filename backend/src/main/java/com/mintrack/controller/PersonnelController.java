package com.mintrack.controller;

import com.mintrack.entity.Personnel;
import com.mintrack.service.PersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personnel")
@RequiredArgsConstructor
public class PersonnelController {
    private final PersonnelService personnelService;

    @GetMapping
    public List<Personnel> getAll(@RequestParam(required = false) Integer siteId,
                                   @RequestParam(required = false) Integer teamId,
                                   @RequestParam(required = false) String department) {
        if (siteId != null) return personnelService.findBySiteId(siteId);
        if (teamId != null) return personnelService.findByTeamId(teamId);
        if (department != null) return personnelService.findByDepartment(department);
        return personnelService.findAll();
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
