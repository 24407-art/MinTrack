package com.mintrack.service.cost;

import com.mintrack.entities.cost.Cost;
import com.mintrack.repository.cost.CostRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CostService {
    private final CostRepository costRepository;

    public CostService(CostRepository costRepository) {
        this.costRepository = costRepository;
    }

    public List<Cost> findBySiteId(Integer siteId) {
        return costRepository.findBySiteIdOrderByDateDesc(siteId);
    }

    public Cost save(Cost cost) {
        return costRepository.save(cost);
    }

    public void delete(Long id) {
        costRepository.deleteById(id);
    }

    public BigDecimal totalBySite(Integer siteId) {
        return costRepository.findBySiteIdOrderByDateDesc(siteId).stream()
                .map(Cost::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
