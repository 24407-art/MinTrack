package com.mintrack.repository;

import com.mintrack.entity.PersonnelSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonnelScheduleRepository extends JpaRepository<PersonnelSchedule, Integer> {
    List<PersonnelSchedule> findByPersonnelId(Integer personnelId);
    Optional<PersonnelSchedule> findByPersonnelIdAndWeekStart(Integer personnelId, LocalDateTime weekStart);
}
