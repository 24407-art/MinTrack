import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Shift } from '../models/shift.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private apiUrl = '/api/shifts';
  private cache = new Map<string, PageResponse<Shift>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string): string {
    return `${page}-${size}-${sortBy}-${sortDir}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc'): Observable<PageResponse<Shift>> {
    const key = this.cacheKey(page, size, sortBy, sortDir);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    return this.http.get<PageResponse<Shift>>(
      `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    ).pipe(tap(res => this.cache.set(key, res)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.apiUrl}/${id}`);
  }

  create(shift: Shift): Observable<Shift> {
    return this.http.post<Shift>(this.apiUrl, shift);
  }

  update(id: number, shift: Shift): Observable<Shift> {
    return this.http.put<Shift>(`${this.apiUrl}/${id}`, shift);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
