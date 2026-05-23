package com.mintrack.repository.personnel;

import com.mintrack.entities.personnel.PersonnelSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonnelScheduleRepository extends JpaRepository<PersonnelSchedule, Integer> {
    List<PersonnelSchedule> findByPersonnelId(Integer personnelId);
    Optional<PersonnelSchedule> findByPersonnelIdAndWeekStart(Integer personnelId, LocalDateTime weekStart);
    Page<PersonnelSchedule> findAll(Pageable pageable);
    Page<PersonnelSchedule> findByPersonnelId(Integer personnelId, Pageable pageable);
}
