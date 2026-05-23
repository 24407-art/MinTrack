package com.mintrack.service.production;

import com.mintrack.entities.production.Production;
import com.mintrack.repository.production.ProductionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductionService {
    private final ProductionRepository productionRepository;

    public List<Production> findAll() {
        return productionRepository.findAll();
    }

    public Page<Production> findAll(Pageable pageable) {
        return productionRepository.findAll(pageable);
    }

    public double sumActualByDate(LocalDate date) {
        return productionRepository.sumActualByDate(date);
    }

    public List<Production> findBySiteId(Integer siteId) {
        return productionRepository.findBySiteId(siteId);
    }

    public Page<Production> findBySiteId(Integer siteId, Pageable pageable) {
        return productionRepository.findBySiteId(siteId, pageable);
    }

    public Optional<Production> findById(Integer id) {
        return productionRepository.findById(id);
    }

    public Production save(Production production) {
        production.setCreatedAt(LocalDateTime.now());
        production.setUpdatedAt(LocalDateTime.now());
        return productionRepository.save(production);
    }

    public Production update(Integer id, Production updated) {
        return productionRepository.findById(id).map(p -> {
            p.setSiteId(updated.getSiteId());
            p.setDate(updated.getDate());
            p.setTarget(updated.getTarget());
            p.setActual(updated.getActual());
            p.setUnit(updated.getUnit());
            p.setNotes(updated.getNotes());
            p.setUpdatedAt(LocalDateTime.now());
            return productionRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Production non trouvée : " + id));
    }

    public void delete(Integer id) {
        productionRepository.deleteById(id);
    }
}
