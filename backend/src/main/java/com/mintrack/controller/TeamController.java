package com.mintrack.controller;

import com.mintrack.entity.Personnel;
import com.mintrack.entity.Team;
import com.mintrack.service.PersonnelService;
import com.mintrack.service.TeamService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
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
        return ResponseEntity.status(201).body(teamService.save(team));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> update(@PathVariable Integer id, @RequestBody Team team) {
        try {
            return ResponseEntity.ok(teamService.update(id, team));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
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
