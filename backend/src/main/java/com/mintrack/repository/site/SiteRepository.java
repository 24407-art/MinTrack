package com.mintrack.repository.site;

import com.mintrack.entities.site.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteRepository extends JpaRepository<Site, Integer> {
    Page<Site> findAll(Pageable pageable);
    long countByStatus(String status);
}
