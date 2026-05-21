package com.mintrack.service;

import com.mintrack.entity.Report;
import com.mintrack.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;

    public List<Report> findAll() {
        return reportRepository.findAll();
    }

    public List<Report> findBySiteId(Integer siteId) {
        return reportRepository.findBySiteId(siteId);
    }

    public List<Report> findByType(String type) {
        return reportRepository.findByType(type);
    }

    public Optional<Report> findById(Integer id) {
        return reportRepository.findById(id);
    }

    public Report save(Report report) {
        report.setCreatedAt(LocalDateTime.now());
        report.setUpdatedAt(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public Report update(Integer id, Report updated) {
        return reportRepository.findById(id).map(r -> {
            r.setTitle(updated.getTitle());
            r.setType(updated.getType());
            r.setContent(updated.getContent());
            r.setSiteId(updated.getSiteId());
            r.setAuthorId(updated.getAuthorId());
            r.setDate(updated.getDate());
            r.setStatus(updated.getStatus());
            r.setUpdatedAt(LocalDateTime.now());
            return reportRepository.save(r);
        }).orElseThrow(() -> new RuntimeException("Rapport non trouvé : " + id));
    }

    public void delete(Integer id) {
        reportRepository.deleteById(id);
    }
}
