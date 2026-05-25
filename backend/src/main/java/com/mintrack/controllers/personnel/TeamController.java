package com.mintrack.controllers.personnel;

import com.mintrack.dto.common.PageResponseDto;
import com.mintrack.entities.audit.AuditLog;
import com.mintrack.entities.personnel.Personnel;
import com.mintrack.entities.personnel.Team;
import com.mintrack.service.audit.AuditLogService;
import com.mintrack.service.personnel.PersonnelService;
import com.mintrack.service.personnel.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final PersonnelService personnelService;
    private final AuditLogService auditLogService;

    @GetMapping
    public PageResponseDto<Team> getAll(
            @RequestParam(required = false) Integer siteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Team> result;
        if (siteId != null) {
            result = teamService.findBySiteId(siteId, pageable);
        } else {
            result = teamService.findAll(pageable);
        }

        return new PageResponseDto<>(
                result.getContent(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getSize()
        );
    }

    @GetMapping("/with-members")
    public ResponseEntity<Map<String, Object>> getAllWithMembers() {
        List<Team> teams = teamService.findAll();
        List<Personnel> personnel = personnelService.findAll();

        List<Map<String, Object>> teamsWithMembers = teams.stream().map(team -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", team.getId());
            map.put("name", team.getName());
            map.put("code", team.getCode());
            map.put("department", team.getDepartment());
            map.put("status", team.getStatus());
            map.put("shiftId", team.getShiftId());
            map.put("site_id", team.getSiteId());
            map.put("site_name", team.getSite() != null ? team.getSite().getName() : null);

            List<Personnel> members = personnel.stream()
                    .filter(p -> team.getId().equals(p.getTeamId()))
                    .toList();
            map.put("chef", members.stream().filter(p -> "chef_equipe".equals(p.getRole())).findFirst().orElse(null));
            map.put("adjoint", members.stream().filter(p -> "adjoint".equals(p.getRole())).findFirst().orElse(null));
            map.put("workers", members.stream().filter(p -> "ouvrier".equals(p.getRole()) && "active".equals(p.getStatus())).toList());
            map.put("workersCount", members.stream().filter(p -> "ouvrier".equals(p.getRole()) && "active".equals(p.getStatus())).count());
            return map;
        }).toList();

        Map<String, List<Map<String, Object>>> byDept = new HashMap<>();
        for (Map<String, Object> t : teamsWithMembers) {
            String dept = (String) t.getOrDefault("department", "Non assigne");
            byDept.computeIfAbsent(dept, k -> new java.util.ArrayList<>()).add(t);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("teams", teamsWithMembers);
        result.put("teamsByDepartment", byDept);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getById(@PathVariable Integer id) {
        return teamService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Team> create(@RequestBody Team team) {
        Team saved = teamService.save(team);
        auditLogService.logEntity(saved.getId(), "team", "CREATE", "name", null, saved.getName(), "system");
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> update(@PathVariable Integer id, @RequestBody Team team) {
        try {
            Team updated = teamService.update(id, team);
            auditLogService.logEntity(id, "team", "UPDATE", "name", null, updated.getName(), "system");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        auditLogService.logEntity(id, "team", "DELETE", "name", "supprimé", null, "system");
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<AuditLog>> getHistory(@PathVariable Integer id) {
        return ResponseEntity.ok(auditLogService.findByEntity(id, "team"));
    }

    @PostMapping("/{teamId}/members/{personnelId}")
    public ResponseEntity<?> assignMember(@PathVariable Integer teamId, @PathVariable Integer personnelId, @RequestParam String role) {
        try {
            teamService.assignMember(teamId, personnelId, role);
            return ResponseEntity.ok(Map.of("success", true, "message", "Personnel assigne a l'equipe"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{teamId}/members/{personnelId}")
    public ResponseEntity<?> removeMember(@PathVariable Integer teamId, @PathVariable Integer personnelId) {
        try {
            teamService.removeMember(personnelId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Personnel retire de l'equipe"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
