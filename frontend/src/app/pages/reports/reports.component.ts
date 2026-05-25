import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  showAddModal = false;
  saving = false;
  newItem: Partial<Report> = {};

  constructor(private reportService: ReportService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.reportService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; this.cdr.detectChanges(); }
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

  openAdd(): void {
    this.newItem = {
      title: '', type: '', content: '', siteId: undefined,
      authorId: undefined, status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
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
      ? this.reportService.update(this.newItem.id, this.newItem as Report)
      : this.reportService.create(this.newItem as Report);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.closeAdd();
        this.reportService.clearCache();
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
    alert('Historique indisponible pour ' + item.title);
  }

  viewItem(item: any): void {
    alert('Contenu du rapport: ' + item.title);
  }

  editItem(item: any): void {
    this.newItem = { ...item };
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  confirmDelete(item: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer le rapport ' + item.title + ' ?')) {
      this.reportService.delete(item.id).subscribe({
        next: () => {
          this.reportService.clearCache();
          this.loadPage(this.currentPage);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Suppression échouée'))
      });
    }
  }
}
