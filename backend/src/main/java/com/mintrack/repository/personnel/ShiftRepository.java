package com.mintrack.repository.personnel;

import com.mintrack.entities.personnel.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    Page<Shift> findAll(Pageable pageable);
    List<Shift> findByStatus(String status);
}
