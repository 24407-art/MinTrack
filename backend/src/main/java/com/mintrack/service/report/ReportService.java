package com.mintrack.service.report;

import com.mintrack.entities.report.Report;
import com.mintrack.repository.report.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<Report> findAll(Pageable pageable) {
        return reportRepository.findAll(pageable);
    }

    public long countByTypeAndStatus(String type, String status) {
        return reportRepository.countByTypeAndStatus(type, status);
    }

    public List<Report> findTop5ByTypeOrderByDateDesc(String type) {
        return reportRepository.findTop5ByTypeOrderByDateDesc(type);
    }

    public List<Report> findBySiteId(Integer siteId) {
        return reportRepository.findBySiteId(siteId);
    }

    public Page<Report> findBySiteId(Integer siteId, Pageable pageable) {
        return reportRepository.findBySiteId(siteId, pageable);
    }

    public List<Report> findByType(String type) {
        return reportRepository.findByType(type);
    }

    public Page<Report> findByType(String type, Pageable pageable) {
        return reportRepository.findByType(type, pageable);
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
