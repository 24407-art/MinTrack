package com.mintrack.service.personnel;

import com.mintrack.entities.personnel.Personnel;
import com.mintrack.entities.personnel.Team;
import com.mintrack.repository.personnel.PersonnelRepository;
import com.mintrack.repository.personnel.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final PersonnelRepository personnelRepository;

    public List<Team> findAll() {
        return teamRepository.findAll();
    }

    public Page<Team> findAll(Pageable pageable) {
        return teamRepository.findAll(pageable);
    }

    public List<Team> findBySiteId(Integer siteId) {
        return teamRepository.findBySiteId(siteId);
    }

    public Page<Team> findBySiteId(Integer siteId, Pageable pageable) {
        return teamRepository.findBySiteId(siteId, pageable);
    }

    public Optional<Team> findById(Integer id) {
        return teamRepository.findById(id);
    }

    public Team save(Team team) {
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        return teamRepository.save(team);
    }

    public Team update(Integer id, Team updated) {
        return teamRepository.findById(id).map(t -> {
            t.setName(updated.getName());
            t.setCode(updated.getCode());
            t.setSiteId(updated.getSiteId());
            t.setDepartment(updated.getDepartment());
            t.setShiftId(updated.getShiftId());
            t.setStatus(updated.getStatus());
            t.setUpdatedAt(LocalDateTime.now());
            return teamRepository.save(t);
        }).orElseThrow(() -> new RuntimeException("Team non trouve : " + id));
    }

    public void delete(Integer id) {
        teamRepository.deleteById(id);
    }

    public void assignMember(Integer teamId, Integer personnelId, String role) {
        Personnel p = personnelRepository.findById(personnelId)
                .orElseThrow(() -> new RuntimeException("Personnel non trouve"));
        p.setTeamId(teamId);
        p.setRole(role);
        p.setUpdatedAt(LocalDateTime.now());
        personnelRepository.save(p);
    }

    public void removeMember(Integer personnelId) {
        Personnel p = personnelRepository.findById(personnelId)
                .orElseThrow(() -> new RuntimeException("Personnel non trouve"));
        p.setTeamId(null);
        p.setRole("ouvrier");
        p.setUpdatedAt(LocalDateTime.now());
        personnelRepository.save(p);
    }
}
