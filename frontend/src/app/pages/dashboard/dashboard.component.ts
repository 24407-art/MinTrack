import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  loading = true;
  error = '';
  today = new Date();

  activeTab = 'overview';
  tabs = [
    { key: 'overview',   label: 'Vue d\'ensemble', icon: 'fa-layer-group' },
    { key: 'production', label: 'Production',      icon: 'fa-file-lines' },
    { key: 'equipment',  label: 'Équipements',     icon: 'fa-cube' },
    { key: 'personnel',  label: 'Personnel',       icon: 'fa-graduation-cap' },
    { key: 'charts',     label: 'Graphiques',      icon: 'fa-chart-pie' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: (err) => { this.error = err.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  maxTonnes(): number {
    if (!this.data?.productionChart?.length) return 1;
    return Math.max(...this.data.productionChart.map(e => e.tonnes));
  }

  setTab(key: string): void {
    this.activeTab = key;
  }

  chartData = {
    total:    { value: 1247,  color: '#006233', label: 'Total' },
    active:   { value: 892,   color: '#FFD700', label: 'Actifs' },
    inactive: { value: 355,   color: '#CE1126', label: 'Inactifs' }
  };
}
