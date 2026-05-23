package com.mintrack.repository.report;

import com.mintrack.entities.report.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findBySiteId(Integer siteId);
    List<Report> findByType(String type);
    Page<Report> findAll(Pageable pageable);
    Page<Report> findBySiteId(Integer siteId, Pageable pageable);
    Page<Report> findByType(String type, Pageable pageable);
    long countByTypeAndStatus(String type, String status);
    List<Report> findTop5ByTypeOrderByDateDesc(String type);
}
