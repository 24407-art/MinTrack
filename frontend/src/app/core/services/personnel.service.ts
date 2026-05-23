import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Personnel } from '../models/personnel.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  private apiUrl = '/api/personnel';
  private cache = new Map<string, PageResponse<Personnel>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string, siteId?: number, teamId?: number, department?: string): string {
    return `${page}-${size}-${sortBy}-${sortDir}-${siteId || ''}-${teamId || ''}-${department || ''}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc', siteId?: number, teamId?: number, department?: string): Observable<PageResponse<Personnel>> {
    const key = this.cacheKey(page, size, sortBy, sortDir, siteId, teamId, department);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    let url = `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (siteId) url += `&siteId=${siteId}`;
    if (teamId) url += `&teamId=${teamId}`;
    if (department) url += `&department=${department}`;
    return this.http.get<PageResponse<Personnel>>(url).pipe(tap(res => this.cache.set(key, res)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.apiUrl}/${id}`);
  }

  create(personnel: Personnel): Observable<Personnel> {
    return this.http.post<Personnel>(this.apiUrl, personnel);
  }

  update(id: number, personnel: Personnel): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.apiUrl}/${id}`, personnel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
