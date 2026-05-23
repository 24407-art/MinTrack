import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DashboardData } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = '/api/dashboard';
  private cache: DashboardData | null = null;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    if (this.cache) {
      return of(this.cache);
    }
    return this.http.get<DashboardData>(this.apiUrl).pipe(
      tap(res => this.cache = res)
    );
  }

  clearCache(): void {
    this.cache = null;
  }
}
