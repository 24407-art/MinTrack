package com.mintrack.service.equipment;

import com.mintrack.entities.equipment.Equipment;
import com.mintrack.repository.equipment.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;

    public List<Equipment> findAll() {
        return equipmentRepository.findAll();
    }

    public Page<Equipment> findAll(Pageable pageable) {
        return equipmentRepository.findAll(pageable);
    }

    public long count() {
        return equipmentRepository.count();
    }

    public long countByStatus(String status) {
        return equipmentRepository.countByStatus(status);
    }

    public List<Equipment> findTop10() {
        return equipmentRepository.findTop10ByOrderByIdAsc();
    }

    public List<Equipment> findBySiteId(Integer siteId) {
        return equipmentRepository.findBySiteId(siteId);
    }

    public Page<Equipment> findBySiteId(Integer siteId, Pageable pageable) {
        return equipmentRepository.findBySiteId(siteId, pageable);
    }

    public Optional<Equipment> findById(Integer id) {
        return equipmentRepository.findById(id);
    }

    public Equipment save(Equipment equipment) {
        equipment.setCreatedAt(LocalDateTime.now());
        equipment.setUpdatedAt(LocalDateTime.now());
        return equipmentRepository.save(equipment);
    }

    public Equipment update(Integer id, Equipment updated) {
        return equipmentRepository.findById(id).map(e -> {
            e.setName(updated.getName());
            e.setType(updated.getType());
            e.setModel(updated.getModel());
            e.setSerial(updated.getSerial());
            e.setSiteId(updated.getSiteId());
            e.setStatus(updated.getStatus());
            e.setPurchaseDate(updated.getPurchaseDate());
            e.setLastMaintenance(updated.getLastMaintenance());
            e.setUpdatedAt(LocalDateTime.now());
            return equipmentRepository.save(e);
        }).orElseThrow(() -> new RuntimeException("Équipement non trouvé : " + id));
    }

    public void delete(Integer id) {
        equipmentRepository.deleteById(id);
    }
}
