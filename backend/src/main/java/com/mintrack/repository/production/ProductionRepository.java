package com.mintrack.repository.production;

import com.mintrack.entities.production.Production;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductionRepository extends JpaRepository<Production, Integer> {
    List<Production> findBySiteId(Integer siteId);
    Page<Production> findAll(Pageable pageable);
    Page<Production> findBySiteId(Integer siteId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.actual), 0) FROM Production p WHERE DATE(p.date) = :date")
    double sumActualByDate(@Param("date") LocalDate date);
}
