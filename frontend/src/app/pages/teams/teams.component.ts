import { Component, OnInit } from '@angular/core';
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

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.teamService.getAll(page, this.pageSize).subscribe({
      next: (res) => { this.page = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
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
}
