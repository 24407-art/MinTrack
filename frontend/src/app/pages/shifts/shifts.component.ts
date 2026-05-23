import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShiftService } from '../../core/services/shift.service';
import { Shift } from '../../core/models/shift.model';
import { PageResponse } from '../../core/models/page-response.model';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss'
})
export class ShiftsComponent implements OnInit {
  page: PageResponse<Shift> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.shiftService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.shiftService.clearCache();
    this.loadPage(0);
  }

  get filteredShifts(): Shift[] {
    if (!this.page) return [];
    if (!this.searchText.trim()) return this.page.content;
    const q = this.searchText.toLowerCase();
    return this.page.content.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.startTime.toLowerCase().includes(q) ||
      s.endTime.toLowerCase().includes(q)
    );
  }

  get stats() {
    const list = this.page?.content || [];
    const total = list.length;
    const active = list.filter(s => s.status === 'ACTIVE').length;
    const totalWorkers = list.reduce((sum, s) => sum + (s.workers || 0), 0);
    const avgWorkers = list.length ? totalWorkers / list.length : 0;
    return { total, active, totalWorkers, avgWorkers };
  }
}
