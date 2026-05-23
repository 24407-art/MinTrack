import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelService } from '../../core/services/personnel.service';
import { Personnel } from '../../core/models/personnel.model';
import { PageResponse } from '../../core/models/page-response.model';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss'
})
export class PersonnelComponent implements OnInit {
  page: PageResponse<Personnel> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';

  constructor(private personnelService: PersonnelService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.personnelService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.personnelService.clearCache();
    this.loadPage(0);
  }

  get filteredPersonnel(): Personnel[] {
    if (!this.page) return [];
    if (!this.searchText.trim()) return this.page.content;
    const q = this.searchText.toLowerCase();
    return this.page.content.filter(p =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  }

  get stats() {
    const list = this.page?.content || [];
    const total = list.length;
    const active = list.filter(p => p.status === 'ACTIVE').length;
    const departments = new Set(list.map(p => p.department)).size;
    const avgSalary = list.length ? list.reduce((s, p) => s + (p.salary || 0), 0) / list.length : 0;
    return { total, active, departments, avgSalary };
  }
}
