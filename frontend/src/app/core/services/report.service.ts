import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Report } from '../models/report.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = '/api/reports';
  private cache = new Map<string, PageResponse<Report>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string): string {
    return `${page}-${size}-${sortBy}-${sortDir}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc'): Observable<PageResponse<Report>> {
    const key = this.cacheKey(page, size, sortBy, sortDir);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    return this.http.get<PageResponse<Report>>(
      `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    ).pipe(tap(res => this.cache.set(key, res)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`);
  }

  create(report: Report): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, report);
  }

  update(id: number, report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/${id}`, report);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
