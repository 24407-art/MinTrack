import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  showAddModal = false;
  saving = false;
  newItem: Partial<Production> = {};

  constructor(private productionService: ProductionService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.productionService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; this.cdr.detectChanges(); }
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

  openAdd(): void {
    this.newItem = {
      siteId: undefined, date: new Date().toISOString().split('T')[0],
      target: 0, actual: 0, unit: 't', notes: ''
    };
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  closeAdd(): void {
    this.showAddModal = false;
    this.error = '';
    this.cdr.detectChanges();
  }

  saveNew(): void {
    this.saving = true;
    const req = this.newItem.id 
      ? this.productionService.update(this.newItem.id, this.newItem as Production)
      : this.productionService.create(this.newItem as Production);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.closeAdd();
        this.productionService.clearCache();
        this.loadPage(this.currentPage);
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Erreur lors de l’enregistrement';
        this.cdr.detectChanges();
      }
    });
  }

  viewHistory(item: any): void {
    alert('Historique indisponible pour cette production');
  }

  viewItem(item: any): void {
    alert('Détails de la production (ID: ' + item.id + ')');
  }

  editItem(item: any): void {
    this.newItem = { ...item };
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  confirmDelete(item: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement de production ?')) {
      this.productionService.delete(item.id).subscribe({
        next: () => {
          this.productionService.clearCache();
          this.loadPage(this.currentPage);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Suppression échouée'))
      });
    }
  }
}
