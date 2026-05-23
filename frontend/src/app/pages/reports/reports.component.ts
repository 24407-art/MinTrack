import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { Report } from '../../core/models/report.model';
import { PageResponse } from '../../core/models/page-response.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  page: PageResponse<Report> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.reportService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.reportService.clearCache();
    this.loadPage(0);
  }

  get filteredReports(): Report[] {
    if (!this.page) return [];
    if (!this.searchText.trim()) return this.page.content;
    const q = this.searchText.toLowerCase();
    return this.page.content.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      (r.siteId && r.siteId.toString().includes(q))
    );
  }

  get stats() {
    const list = this.page?.content || [];
    const total = list.length;
    const completed = list.filter(r => r.status === 'COMPLETED').length;
    const pending = list.filter(r => r.status === 'PENDING').length;
    const types = new Set(list.map(r => r.type)).size;
    return { total, completed, pending, types };
  }
}
