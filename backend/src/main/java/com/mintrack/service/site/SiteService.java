package com.mintrack.service.site;

import com.mintrack.entities.site.Site;
import com.mintrack.repository.site.SiteRepository;
import com.mintrack.service.audit.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SiteService {
    private final SiteRepository siteRepository;
    private final AuditLogService auditLogService;

    public List<Site> findAll() {
        return siteRepository.findAll();
    }

    public Page<Site> findAll(Pageable pageable) {
        return siteRepository.findAll(pageable);
    }

    public long count() {
        return siteRepository.count();
    }

    public long countByStatus(String status) {
        return siteRepository.countByStatus(status);
    }

    public Optional<Site> findById(Integer id) {
        return siteRepository.findById(id);
    }

    public Site save(Site site) {
        site.setCreatedAt(LocalDateTime.now());
        site.setUpdatedAt(LocalDateTime.now());
        Site saved = siteRepository.save(site);
        auditLogService.log(saved.getId(), "CREATE", "site", null, saved.getName(), "system");
        return saved;
    }

    public Site update(Integer id, Site updated) {
        return siteRepository.findById(id).map(site -> {
            String oldName = site.getName();
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
            Site saved = siteRepository.save(site);
            auditLogService.log(saved.getId(), "UPDATE", "site", oldName, saved.getName(), "system");
            return saved;
        }).orElseThrow(() -> new RuntimeException("Site non trouvé : " + id));
    }

    public void delete(Integer id) {
        siteRepository.findById(id).ifPresent(site -> {
            auditLogService.log(id, "DELETE", "site", site.getName(), null, "system");
        });
        siteRepository.deleteById(id);
    }
}
