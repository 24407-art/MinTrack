import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Production } from '../models/production.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ProductionService {
  private apiUrl = '/api/production';
  private cache = new Map<string, PageResponse<Production>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string, siteId?: number): string {
    return `${page}-${size}-${sortBy}-${sortDir}-${siteId || ''}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc', siteId?: number): Observable<PageResponse<Production>> {
    const key = this.cacheKey(page, size, sortBy, sortDir, siteId);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }

    let url = `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (siteId) url += `&siteId=${siteId}`;
    return this.http.get<PageResponse<Production>>(url).pipe(
      tap(res => this.cache.set(key, res))
    );
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Production> {
    return this.http.get<Production>(`${this.apiUrl}/${id}`);
  }

  create(production: Production): Observable<Production> {
    return this.http.post<Production>(this.apiUrl, production);
  }

  update(id: number, production: Production): Observable<Production> {
    return this.http.put<Production>(`${this.apiUrl}/${id}`, production);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
