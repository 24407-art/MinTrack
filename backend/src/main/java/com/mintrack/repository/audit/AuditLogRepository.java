package com.mintrack.repository.audit;

import com.mintrack.entities.audit.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findBySiteIdOrderByTimestampDesc(Integer siteId);
}
