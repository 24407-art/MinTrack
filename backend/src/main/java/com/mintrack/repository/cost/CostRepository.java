package com.mintrack.repository.cost;

import com.mintrack.entities.cost.Cost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CostRepository extends JpaRepository<Cost, Long> {
    List<Cost> findBySiteIdOrderByDateDesc(Integer siteId);
}
