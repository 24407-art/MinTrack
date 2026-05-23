package com.mintrack.repository.personnel;

import com.mintrack.entities.personnel.Personnel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Integer> {
    List<Personnel> findBySiteId(Integer siteId);
    List<Personnel> findByTeamId(Integer teamId);
    List<Personnel> findByDepartment(String department);
    Page<Personnel> findAll(Pageable pageable);
    Page<Personnel> findBySiteId(Integer siteId, Pageable pageable);
    Page<Personnel> findByTeamId(Integer teamId, Pageable pageable);
    Page<Personnel> findByDepartment(String department, Pageable pageable);
    long countByStatus(String status);
}
