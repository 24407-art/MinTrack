import { Component, OnInit } from '@angular/core';
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

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.equipmentService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
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
}
