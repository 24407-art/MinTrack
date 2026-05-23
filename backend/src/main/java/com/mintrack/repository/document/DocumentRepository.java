package com.mintrack.repository.document;

import com.mintrack.entities.document.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findBySiteIdOrderByUploadedAtDesc(Integer siteId);
}
