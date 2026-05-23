import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Site } from '../models/site.model';
import { PageResponse } from '../models/page-response.model';
import { AuditLog } from '../models/audit-log.model';
import { Document } from '../models/document.model';
import { Cost } from '../models/cost.model';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private apiUrl = '/api/sites';
  private cache = new Map<string, PageResponse<Site>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string): string {
    return `${page}-${size}-${sortBy}-${sortDir}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc'): Observable<PageResponse<Site>> {
    const key = this.cacheKey(page, size, sortBy, sortDir);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    return this.http.get<PageResponse<Site>>(
      `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    ).pipe(tap(res => this.cache.set(key, res)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Site> {
    return this.http.get<Site>(`${this.apiUrl}/${id}`);
  }

  create(site: Site): Observable<Site> {
    return this.http.post<Site>(this.apiUrl, site);
  }

  update(id: number, site: Site): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/${id}`, site);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getHistory(siteId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/${siteId}/history`);
  }

  getAllUnpaged(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/all`);
  }

  getDocuments(siteId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/${siteId}/documents`);
  }

  uploadDocument(siteId: number, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Document>(`${this.apiUrl}/${siteId}/documents`, formData);
  }

  deleteDocument(siteId: number, docId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${siteId}/documents/${docId}`);
  }

  downloadDocument(siteId: number, docId: number): string {
    return `${this.apiUrl}/${siteId}/documents/${docId}/download`;
  }

  downloadDocumentBlob(siteId: number, docId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${siteId}/documents/${docId}/download`, { responseType: 'blob' });
  }

  getCosts(siteId: number): Observable<Cost[]> {
    return this.http.get<Cost[]>(`${this.apiUrl}/${siteId}/costs`);
  }

  addCost(siteId: number, cost: Partial<Cost>): Observable<Cost> {
    return this.http.post<Cost>(`${this.apiUrl}/${siteId}/costs`, cost);
  }

  deleteCost(siteId: number, costId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${siteId}/costs/${costId}`);
  }
}
