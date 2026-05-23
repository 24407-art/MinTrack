package com.mintrack.service.personnel;

import com.mintrack.entities.personnel.Personnel;
import com.mintrack.repository.personnel.PersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonnelService {
    private final PersonnelRepository personnelRepository;

    public List<Personnel> findAll() {
        return personnelRepository.findAll();
    }

    public Page<Personnel> findAll(Pageable pageable) {
        return personnelRepository.findAll(pageable);
    }

    public long countByStatus(String status) {
        return personnelRepository.countByStatus(status);
    }

    public List<Personnel> findBySiteId(Integer siteId) {
        return personnelRepository.findBySiteId(siteId);
    }

    public Page<Personnel> findBySiteId(Integer siteId, Pageable pageable) {
        return personnelRepository.findBySiteId(siteId, pageable);
    }

    public List<Personnel> findByTeamId(Integer teamId) {
        return personnelRepository.findByTeamId(teamId);
    }

    public Page<Personnel> findByTeamId(Integer teamId, Pageable pageable) {
        return personnelRepository.findByTeamId(teamId, pageable);
    }

    public List<Personnel> findByDepartment(String department) {
        return personnelRepository.findByDepartment(department);
    }

    public Page<Personnel> findByDepartment(String department, Pageable pageable) {
        return personnelRepository.findByDepartment(department, pageable);
    }

    public Optional<Personnel> findById(Integer id) {
        return personnelRepository.findById(id);
    }

    public Personnel save(Personnel personnel) {
        personnel.setCreatedAt(LocalDateTime.now());
        personnel.setUpdatedAt(LocalDateTime.now());
        return personnelRepository.save(personnel);
    }

    public Personnel update(Integer id, Personnel updated) {
        return personnelRepository.findById(id).map(p -> {
            p.setFirstName(updated.getFirstName());
            p.setLastName(updated.getLastName());
            p.setEmail(updated.getEmail());
            p.setPhone(updated.getPhone());
            p.setPosition(updated.getPosition());
            p.setRole(updated.getRole());
            p.setDepartment(updated.getDepartment());
            p.setSiteId(updated.getSiteId());
            p.setTeamId(updated.getTeamId());
            p.setHireDate(updated.getHireDate());
            p.setSalary(updated.getSalary());
            p.setStatus(updated.getStatus());
            p.setUpdatedAt(LocalDateTime.now());
            return personnelRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Personnel non trouvé : " + id));
    }

    public void delete(Integer id) {
        personnelRepository.deleteById(id);
    }
}
