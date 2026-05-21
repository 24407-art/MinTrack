package com.mintrack.service;

import com.mintrack.entity.Site;
import com.mintrack.repository.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SiteService {
    private final SiteRepository siteRepository;

    public List<Site> findAll() {
        return siteRepository.findAll();
    }

    public Optional<Site> findById(Integer id) {
        return siteRepository.findById(id);
    }

    public Site save(Site site) {
        site.setCreatedAt(LocalDateTime.now());
        site.setUpdatedAt(LocalDateTime.now());
        return siteRepository.save(site);
    }

    public Site update(Integer id, Site updated) {
        return siteRepository.findById(id).map(site -> {
            site.setName(updated.getName());
            site.setCode(updated.getCode());
            site.setMineral(updated.getMineral());
            site.setRegion(updated.getRegion());
            site.setCoordinates(updated.getCoordinates());
            site.setStatus(updated.getStatus());
            site.setCapacity(updated.getCapacity());
            site.setCurrentProduction(updated.getCurrentProduction());
            site.setWorkers(updated.getWorkers());
            site.setEquipmentCount(updated.getEquipmentCount());
            site.setStartDate(updated.getStartDate());
            site.setArea(updated.getArea());
            site.setUpdatedAt(LocalDateTime.now());
            return siteRepository.save(site);
        }).orElseThrow(() -> new RuntimeException("Site non trouvé : " + id));
    }

    public void delete(Integer id) {
        siteRepository.deleteById(id);
    }
}
