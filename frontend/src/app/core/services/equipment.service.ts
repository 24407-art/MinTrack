import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Equipment } from '../models/equipment.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private apiUrl = '/api/equipment';
  private cache = new Map<string, PageResponse<Equipment>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string, siteId?: number): string {
    return `${page}-${size}-${sortBy}-${sortDir}-${siteId || ''}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc', siteId?: number): Observable<PageResponse<Equipment>> {
    const key = this.cacheKey(page, size, sortBy, sortDir, siteId);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    let url = `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (siteId) url += `&siteId=${siteId}`;
    return this.http.get<PageResponse<Equipment>>(url).pipe(tap(res => this.cache.set(key, res)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }

  create(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrl, equipment);
  }

  update(id: number, equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.apiUrl}/${id}`, equipment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
