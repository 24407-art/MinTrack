package com.mintrack.service;

import com.mintrack.entity.Shift;
import com.mintrack.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShiftService {
    private final ShiftRepository shiftRepository;

    public List<Shift> findAll() {
        return shiftRepository.findAll();
    }

    public Optional<Shift> findById(Integer id) {
        return shiftRepository.findById(id);
    }

    public Shift save(Shift shift) {
        shift.setCreatedAt(LocalDateTime.now());
        shift.setUpdatedAt(LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    public Shift update(Integer id, Shift updated) {
        return shiftRepository.findById(id).map(s -> {
            s.setName(updated.getName());
            s.setStartTime(updated.getStartTime());
            s.setEndTime(updated.getEndTime());
            s.setWorkers(updated.getWorkers());
            s.setStatus(updated.getStatus());
            s.setUpdatedAt(LocalDateTime.now());
            return shiftRepository.save(s);
        }).orElseThrow(() -> new RuntimeException("Shift non trouvé : " + id));
    }

    public void delete(Integer id) {
        shiftRepository.deleteById(id);
    }
}
