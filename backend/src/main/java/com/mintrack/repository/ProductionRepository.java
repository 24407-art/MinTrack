package com.mintrack.repository;

import com.mintrack.entity.Production;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionRepository extends JpaRepository<Production, Integer> {
    List<Production> findBySiteId(Integer siteId);
}
