import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../core/services/team.service';
import { Team } from '../../core/models/team.model';
import { PageResponse } from '../../core/models/page-response.model';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  page: PageResponse<Team> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';

  showAddModal = false;
  saving = false;
  newItem: Partial<Team> = {};

  viewingItem: Team | null = null;
  showHistory = false;
  historyLoading = false;

  constructor(private teamService: TeamService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.teamService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.teamService.clearCache();
    this.loadPage(0);
  }

  get filteredTeams(): Team[] {
    if (!this.page) return [];
    if (!this.searchText.trim()) return this.page.content;
    const q = this.searchText.toLowerCase();
    return this.page.content.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      (t.siteId && t.siteId.toString().includes(q))
    );
  }

  get stats() {
    const list = this.page?.content || [];
    const total = list.length;
    const active = list.filter(t => t.status === 'ACTIVE').length;
    const departments = new Set(list.map(t => t.department)).size;
    const withChef = list.filter(t => t.chefId).length;
    return { total, active, departments, withChef };
  }

  openAdd(): void {
    this.newItem = {
      name: '', code: '', department: '', siteId: undefined,
      shiftId: undefined, chefId: undefined, adjointId: undefined, status: 'ACTIVE'
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
      ? this.teamService.update(this.newItem.id, this.newItem as Team)
      : this.teamService.create(this.newItem as Team);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.closeAdd();
        this.teamService.clearCache();
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + item.name + ' ?')) {
      this.teamService.delete(item.id).subscribe({
        next: () => {
          this.teamService.clearCache();
          this.loadPage(this.currentPage);
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || 'Suppression échouée'))
      });
    }
  }
}
