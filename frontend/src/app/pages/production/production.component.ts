import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionService } from '../../core/services/production.service';
import { Production } from '../../core/models/production.model';
import { PageResponse } from '../../core/models/page-response.model';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production.component.html',
  styleUrl: './production.component.scss'
})
export class ProductionComponent implements OnInit {
  page: PageResponse<Production> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';

  constructor(private productionService: ProductionService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.productionService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.productionService.clearCache();
    this.loadPage(0);
  }

  get filteredProduction(): Production[] {
    if (!this.page) return [];
    if (!this.searchText.trim()) return this.page.content;
    const q = this.searchText.toLowerCase();
    return this.page.content.filter(p =>
      (p.notes && p.notes.toLowerCase().includes(q)) ||
      (p.unit && p.unit.toLowerCase().includes(q)) ||
      (p.siteId && p.siteId.toString().includes(q))
    );
  }

  get stats() {
    const list = this.page?.content || [];
    const total = list.length;
    const totalTarget = list.reduce((s, p) => s + (p.target || 0), 0);
    const totalActual = list.reduce((s, p) => s + (p.actual || 0), 0);
    const efficiency = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
    return { total, totalTarget, totalActual, efficiency };
  }
}
