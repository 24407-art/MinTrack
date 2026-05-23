package com.mintrack.service.document;

import com.mintrack.entities.document.Document;
import com.mintrack.repository.document.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final Path uploadPath = Paths.get("uploads/documents");

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le dossier uploads", e);
        }
    }

    public List<Document> findBySiteId(Integer siteId) {
        return documentRepository.findBySiteIdOrderByUploadedAtDesc(siteId);
    }

    public Document upload(Integer siteId, MultipartFile file, String uploadedBy) {
        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : "";
        String fileName = UUID.randomUUID() + ext;
        Path target = uploadPath.resolve(fileName);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload", e);
        }

        Document doc = new Document();
        doc.setSiteId(siteId);
        doc.setName(originalName != null ? originalName : fileName);
        doc.setType(file.getContentType());
        doc.setSize(file.getSize());
        doc.setFilePath(target.toString());
        doc.setUploadedBy(uploadedBy != null ? uploadedBy : "system");
        return documentRepository.save(doc);
    }

    public void delete(Long id) {
        Document doc = documentRepository.findById(id).orElse(null);
        if (doc != null && doc.getFilePath() != null) {
            try {
                Files.deleteIfExists(Paths.get(doc.getFilePath()));
            } catch (IOException ignored) {}
        }
        documentRepository.deleteById(id);
    }
}
