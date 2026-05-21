package com.mintrack.service;

import com.mintrack.entity.Equipment;
import com.mintrack.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
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

    public List<Equipment> findBySiteId(Integer siteId) {
        return equipmentRepository.findBySiteId(siteId);
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
