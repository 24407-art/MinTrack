import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  showAddModal = false;
  saving = false;
  newItem: Partial<Shift> = {};

  constructor(private shiftService: ShiftService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.shiftService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; this.cdr.detectChanges(); }
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

  openAdd(): void {
    this.newItem = {
      name: '', startTime: '06:00', endTime: '14:00', workers: 0, status: 'ACTIVE'
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
      ? this.shiftService.update(this.newItem.id, this.newItem as Shift)
      : this.shiftService.create(this.newItem as Shift);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.closeAdd();
        this.shiftService.clearCache();
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
    alert('Historique indisponible pour ' + item.name);
  }

  viewItem(item: any): void {
    alert('Détails de ' + item.name);
  }

  editItem(item: any): void {
    this.newItem = { ...item };
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  confirmDelete(item: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + item.name + ' ?')) {
      this.shiftService.delete(item.id).subscribe({
        next: () => {
          this.shiftService.clearCache();
          this.loadPage(this.currentPage);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Suppression échouée'))
      });
    }
  }
}
