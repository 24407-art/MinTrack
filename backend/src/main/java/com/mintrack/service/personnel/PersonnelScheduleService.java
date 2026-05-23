package com.mintrack.service.personnel;

import com.mintrack.entities.personnel.PersonnelSchedule;
import com.mintrack.repository.personnel.PersonnelScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonnelScheduleService {
    private final PersonnelScheduleRepository repository;

    public List<PersonnelSchedule> findByPersonnelId(Integer personnelId) {
        return repository.findByPersonnelId(personnelId);
    }

    public Page<PersonnelSchedule> findByPersonnelId(Integer personnelId, Pageable pageable) {
        return repository.findByPersonnelId(personnelId, pageable);
    }

    public Optional<PersonnelSchedule> findByPersonnelIdAndWeekStart(Integer personnelId, LocalDateTime weekStart) {
        return repository.findByPersonnelIdAndWeekStart(personnelId, weekStart);
    }

    public Page<PersonnelSchedule> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public PersonnelSchedule save(PersonnelSchedule schedule) {
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setUpdatedAt(LocalDateTime.now());
        return repository.save(schedule);
    }

    public PersonnelSchedule update(Integer id, PersonnelSchedule updated) {
        return repository.findById(id).map(s -> {
            s.setMonday(updated.getMonday());
            s.setTuesday(updated.getTuesday());
            s.setWednesday(updated.getWednesday());
            s.setThursday(updated.getThursday());
            s.setFriday(updated.getFriday());
            s.setSaturday(updated.getSaturday());
            s.setSunday(updated.getSunday());
            s.setUpdatedAt(LocalDateTime.now());
            return repository.save(s);
        }).orElseThrow(() -> new RuntimeException("Schedule non trouve : " + id));
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
