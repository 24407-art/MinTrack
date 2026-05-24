import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../../core/services/equipment.service';
import { Equipment } from '../../core/models/equipment.model';
import { PageResponse } from '../../core/models/page-response.model';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent implements OnInit {
  page: PageResponse<Equipment> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';

  showAddModal = false;
  saving = false;
  newItem: Partial<Equipment> = {};

  constructor(private equipmentService: EquipmentService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.equipmentService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.equipmentService.clearCache();
    this.loadPage(0);
  }

  get filteredEquipment(): Equipment[] {
    if (!this.page) return [];
    if (!this.searchText.trim()) return this.page.content;
    const q = this.searchText.toLowerCase();
    return this.page.content.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.model.toLowerCase().includes(q) ||
      e.serial.toLowerCase().includes(q)
    );
  }

  get stats() {
    const list = this.page?.content || [];
    const total = list.length;
    const active = list.filter(e => e.status === 'ACTIVE').length;
    const maintenance = list.filter(e => e.status === 'MAINTENANCE').length;
    const broken = list.filter(e => e.status === 'BROKEN').length;
    return { total, active, maintenance, broken };
  }

  openAdd(): void {
    this.newItem = {
      name: '', type: '', model: '', serial: '', siteId: undefined,
      status: 'ACTIVE', purchaseDate: new Date().toISOString().split('T')[0]
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
      ? this.equipmentService.update(this.newItem.id, this.newItem as Equipment)
      : this.equipmentService.create(this.newItem as Equipment);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.closeAdd();
        this.equipmentService.clearCache();
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
      this.equipmentService.delete(item.id).subscribe({
        next: () => {
          this.equipmentService.clearCache();
          this.loadPage(this.currentPage);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Suppression échouée'))
      });
    }
  }
}
