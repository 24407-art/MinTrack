import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  showAddModal = false;
  saving = false;
  newItem: Partial<Personnel> = {};

  viewingItem: Personnel | null = null;
  showHistory = false;
  historyLoading = false;

  constructor(private personnelService: PersonnelService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.personnelService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; this.cdr.detectChanges(); }
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

  openAdd(): void {
    this.newItem = {
      firstName: '', lastName: '', email: '', phone: '',
      position: '', role: 'ouvrier', department: '', status: 'ACTIVE',
      salary: 0, hireDate: new Date().toISOString().split('T')[0]
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
      ? this.personnelService.update(this.newItem.id, this.newItem as Personnel)
      : this.personnelService.create(this.newItem as Personnel);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.closeAdd();
        this.personnelService.clearCache();
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
    this.viewingItem = item;
    this.showHistory = true;
    this.historyLoading = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.historyLoading = false;
      this.cdr.detectChanges();
    }, 400);
  }

  closeHistory(): void {
    this.showHistory = false;
    this.viewingItem = null;
  }

  viewItem(item: any): void {
    this.viewingItem = item;
    this.showHistory = false;
  }

  closeView(): void {
    this.viewingItem = null;
  }

  editItem(item: any): void {
    this.newItem = { ...item };
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  confirmDelete(item: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + item.lastName + ' ?')) {
      this.personnelService.delete(item.id).subscribe({
        next: () => {
          this.personnelService.clearCache();
          this.loadPage(this.currentPage);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Suppression échouée'))
      });
    }
  }
}
