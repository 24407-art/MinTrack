package com.mintrack.repository;

import com.mintrack.entity.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonnelRepository extends JpaRepository<Personnel, Integer> {
    List<Personnel> findBySiteId(Integer siteId);
    List<Personnel> findByTeamId(Integer teamId);
    List<Personnel> findByDepartment(String department);
}
