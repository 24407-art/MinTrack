package com.mintrack.service.audit;

import com.mintrack.entities.audit.AuditLog;
import com.mintrack.repository.audit.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    public void log(Integer siteId, String action, String field, String oldValue, String newValue, String username) {
        AuditLog log = new AuditLog();
        log.setSiteId(siteId);
        log.setEntityId(siteId);
        log.setEntityType("site");
        log.setAction(action);
        log.setField(field);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setUsername(username != null ? username : "system");
        auditLogRepository.save(log);
    }

    public void logEntity(Integer entityId, String entityType, String action, String field, String oldValue, String newValue, String username) {
        AuditLog log = new AuditLog();
        log.setEntityId(entityId);
        log.setEntityType(entityType);
        log.setAction(action);
        log.setField(field);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        log.setUsername(username != null ? username : "system");
        auditLogRepository.save(log);
    }

    public List<AuditLog> findBySiteId(Integer siteId) {
        return auditLogRepository.findBySiteIdOrderByTimestampDesc(siteId);
    }

    public List<AuditLog> findByEntity(Integer entityId, String entityType) {
        return auditLogRepository.findByEntityIdAndEntityTypeOrderByTimestampDesc(entityId, entityType);
    }
}
