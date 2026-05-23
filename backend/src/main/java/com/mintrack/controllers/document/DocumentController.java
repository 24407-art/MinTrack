package com.mintrack.controllers.document;

import com.mintrack.entities.document.Document;
import com.mintrack.service.document.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/sites")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping("/{siteId}/documents")
    public ResponseEntity<List<Document>> list(@PathVariable Integer siteId) {
        return ResponseEntity.ok(documentService.findBySiteId(siteId));
    }

    @PostMapping("/{siteId}/documents")
    public ResponseEntity<Document> upload(
            @PathVariable Integer siteId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(201).body(documentService.upload(siteId, file, "admin"));
    }

    @GetMapping("/{siteId}/documents/{docId}/download")
    public ResponseEntity<Resource> download(@PathVariable Integer siteId, @PathVariable Long docId) {
        Document doc = documentService.findBySiteId(siteId).stream()
                .filter(d -> d.getId().equals(docId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));
        FileSystemResource resource = new FileSystemResource(Paths.get(doc.getFilePath()));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @DeleteMapping("/{siteId}/documents/{docId}")
    public ResponseEntity<Void> delete(@PathVariable Integer siteId, @PathVariable Long docId) {
        documentService.delete(docId);
        return ResponseEntity.noContent().build();
    }
}
