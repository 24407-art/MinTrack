package com.mintrack.repository.equipment;

import com.mintrack.entities.equipment.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Integer> {
    List<Equipment> findBySiteId(Integer siteId);
    Page<Equipment> findAll(Pageable pageable);
    Page<Equipment> findBySiteId(Integer siteId, Pageable pageable);
    long countByStatus(String status);
    List<Equipment> findTop10ByOrderByIdAsc();
}
