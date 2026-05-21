package com.mintrack.repository;

import com.mintrack.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findBySiteId(Integer siteId);
    List<Report> findByType(String type);
}
