import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Team } from '../models/team.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private apiUrl = '/api/teams';
  private cache = new Map<string, PageResponse<Team>>();

  constructor(private http: HttpClient) {}

  private cacheKey(page: number, size: number, sortBy: string, sortDir: string): string {
    return `${page}-${size}-${sortBy}-${sortDir}`;
  }

  getAll(page = 0, size = 10, sortBy = 'id', sortDir = 'asc'): Observable<PageResponse<Team>> {
    const key = this.cacheKey(page, size, sortBy, sortDir);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    return this.http.get<PageResponse<Team>>(
      `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    ).pipe(tap(res => this.cache.set(key, res)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  update(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
