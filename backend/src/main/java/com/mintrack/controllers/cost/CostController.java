package com.mintrack.controllers.cost;

import com.mintrack.entities.cost.Cost;
import com.mintrack.service.cost.CostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/sites")
@RequiredArgsConstructor
public class CostController {
    private final CostService costService;

    @GetMapping("/{siteId}/costs")
    public ResponseEntity<List<Cost>> list(@PathVariable Integer siteId) {
        return ResponseEntity.ok(costService.findBySiteId(siteId));
    }

    @PostMapping("/{siteId}/costs")
    public ResponseEntity<Cost> create(@PathVariable Integer siteId, @RequestBody Cost cost) {
        cost.setSiteId(siteId);
        return ResponseEntity.status(201).body(costService.save(cost));
    }

    @DeleteMapping("/{siteId}/costs/{costId}")
    public ResponseEntity<Void> delete(@PathVariable Integer siteId, @PathVariable Long costId) {
        costService.delete(costId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{siteId}/costs/total")
    public ResponseEntity<BigDecimal> total(@PathVariable Integer siteId) {
        return ResponseEntity.ok(costService.totalBySite(siteId));
    }
}
