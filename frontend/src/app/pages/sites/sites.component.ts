import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import * as L from 'leaflet';
import { SiteService } from '../../core/services/site.service';
import { Site } from '../../core/models/site.model';
import { PageResponse } from '../../core/models/page-response.model';
import { AuditLog } from '../../core/models/audit-log.model';
import { Document } from '../../core/models/document.model';
import { Cost } from '../../core/models/cost.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit, OnDestroy, AfterViewChecked {
  page: PageResponse<Site> | null = null;
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  searchText = '';
  viewingSite: Site | null = null;
  viewingHistory: AuditLog[] = [];
  historyLoading = false;
  siteDocuments: Document[] = [];
  documentsLoading = false;
  uploadingDoc = false;
  siteCosts: Cost[] = [];
  costsLoading = false;
  newCost: Partial<Cost> = { category: 'Opération', amount: 0, description: '' };
  addingCost = false;
  budgetVisible = false;
  viewTab: 'details' | 'documents' | 'budget' = 'details';
  siteToDelete: Site | null = null;
  deleting = false;
  exportOpen = false;
  filterStatus = '';
  filterRegion = '';
  filterMineral = '';
  filterCapacityMin: number | null = null;
  regionOptions = ['Adrar', 'Assaba', 'Brakna', 'Dakhlet Nouadhibou', 'Gorgol', 'Guidimaka', 'Hodh Ech Chargui', 'Hodh El Gharbi', 'Inchiri', 'Nouakchott', 'Tagant', 'Tiris Zemmour', 'Trarza'];
  mineralOptions = ['Or', 'Cuivre', 'Zinc', 'Plomb', 'Nickel', 'Cobalt', 'Manganèse', 'Autre'];
  viewMode: 'list' | 'cards' | 'map' = 'list';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  private map: L.Map | null = null;
  private mapInitialized = false;
  Math = Math;

  // Comparison
  compareMode = false;
  selectedForCompare: Site[] = [];
  comparingSites: Site[] | null = null;

  private destroy$ = new Subject<void>();

  constructor(public siteService: SiteService, private cdr: ChangeDetectorRef, private router: Router) {}

  toggleView(mode: 'list' | 'cards' | 'map'): void {
    this.viewMode = mode;
    if (mode === 'map') {
      this.mapInitialized = false;
    } else {
      this.map?.remove();
      this.map = null;
      this.mapInitialized = false;
    }
    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    if (this.viewMode === 'map' && !this.mapInitialized) {
      const el = document.getElementById('sitesMap');
      if (el) {
        this.initMap();
      }
    }
  }

  private initMap(): void {
    this.mapInitialized = true;
    const el = document.getElementById('sitesMap');
    if (!el) return;

    this.map = L.map(el).setView([20.3, -10.1], 6);
    this.map.setMinZoom(5);
    this.map.setMaxZoom(12);
    this.map.setMaxBounds([[15, -17.5], [27.5, -4.5]]);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.siteService.getAllUnpaged().subscribe({
      next: (sites) => {
        this.renderMapMarkers(sites);
      },
      error: () => {
        this.renderMapMarkers(this.filteredSites);
      }
    });
  }

  private regionCoords: Record<string, [number, number]> = {
    'Adrar': [20.5, -13.1],
    'Assaba': [16.6, -11.4],
    'Brakna': [17.3, -13.5],
    'Dakhlet Nouadhibou': [20.9, -17.0],
    'Gorgol': [16.1, -12.8],
    'Guidimaka': [15.3, -12.3],
    'Hodh Ech Chargui': [16.5, -7.3],
    'Hodh El Gharbi': [16.6, -9.6],
    'Inchiri': [20.1, -15.2],
    'Nouakchott': [18.1, -15.9],
    'Tagant': [18.3, -11.4],
    'Tiris Zemmour': [22.7, -12.3],
    'Trarza': [17.9, -14.7]
  };

  private renderMapMarkers(sites: Site[]): void {
    if (!this.map) return;
    const bounds = L.latLngBounds([]);

    sites.forEach(site => {
      let coords = this.parseCoords(site.coordinates);
      if (!coords && site.region && this.regionCoords[site.region]) {
        const rc = this.regionCoords[site.region];
        coords = { lat: rc[0] + (Math.random() - 0.5) * 0.4, lng: rc[1] + (Math.random() - 0.5) * 0.4 };
      }
      if (!coords) return;

      const color = site.status === 'active' ? '#006233' : site.status === 'inactive' ? '#FFD700' : '#CE1126';
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(this.map!);

      marker.bindTooltip(site.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'site-tooltip'
      });

      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:180px;">
          <strong style="color:#006233;font-size:1rem;">${site.name}</strong><br>
          <span style="color:#666;font-size:0.8rem;">${site.code} — ${site.mineral}</span><br>
          <span style="color:#666;font-size:0.8rem;">${site.region}</span><br>
          <span style="color:#666;font-size:0.8rem;">Capacité: ${site.capacity?.toLocaleString() || 0} t/j</span>
        </div>
      `);

      bounds.extend([coords.lat, coords.lng]);
    });

    if (bounds.isValid() && sites.length > 1) {
      this.map!.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    }
  }

  private parseCoords(coordStr: string | undefined): { lat: number; lng: number } | null {
    if (!coordStr) return null;
    const parts = coordStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return null;
  }

  toggleExport(): void {
    this.exportOpen = !this.exportOpen;
  }

  exportCSV(): void {
    this.exportOpen = false;
    const data = this.filteredSites;
    if (!data.length) return;
    const headers = ['Nom', 'Code', 'Minéral', 'Région', 'Statut', 'Capacité', 'Production', 'Ouvriers', 'Équipements', 'Coordonnées', 'Superficie'];
    const rows = data.map(s => [
      s.name, s.code, s.mineral, s.region, s.status,
      s.capacity, s.currentProduction, s.workers, s.equipmentCount,
      s.coordinates || '', s.area || ''
    ]);
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sites_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportPDF(): void {
    this.exportOpen = false;
    window.print();
  }

  ngOnInit(): void {
    this.loadPage();
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(e => {
      if (e instanceof NavigationEnd && e.urlAfterRedirects === '/sites') {
        this.loadPage(this.currentPage);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewSite(site: Site): void {
    this.viewingSite = site;
    this.siteDocuments = [];
    this.siteCosts = [];
    if (site.id) {
      this.documentsLoading = true;
      this.costsLoading = true;
      this.siteService.getDocuments(site.id).subscribe({
        next: (docs) => {
          this.siteDocuments = docs;
          this.documentsLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.documentsLoading = false;
          this.cdr.detectChanges();
        }
      });
      this.siteService.getCosts(site.id).subscribe({
        next: (costs) => {
          this.siteCosts = costs;
          this.costsLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.costsLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeView(): void {
    this.viewingSite = null;
    this.siteDocuments = [];
    this.siteCosts = [];
  }

  getDocType(type: string): string {
    if (!type) return 'other';
    if (type.includes('pdf')) return 'pdf';
    if (type.startsWith('image/')) return 'image';
    return 'other';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  onDocSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.viewingSite?.id) return;
    this.uploadingDoc = true;
    this.cdr.detectChanges();
    this.siteService.uploadDocument(this.viewingSite.id, file).subscribe({
      next: (doc) => {
        this.siteDocuments.unshift(doc);
        this.uploadingDoc = false;
        input.value = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.uploadingDoc = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteDocument(docId: number): void {
    if (!this.viewingSite?.id) return;
    this.siteService.deleteDocument(this.viewingSite.id, docId).subscribe({
      next: () => {
        this.siteDocuments = this.siteDocuments.filter(d => d.id !== docId);
        this.cdr.detectChanges();
      }
    });
  }

  downloadDoc(doc: Document): void {
    if (!this.viewingSite?.id) return;
    this.siteService.downloadDocumentBlob(this.viewingSite.id, doc.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  previewDoc(doc: Document): void {
    if (!this.viewingSite?.id) return;
    this.siteService.downloadDocumentBlob(this.viewingSite.id, doc.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        if (doc.type?.startsWith('image/')) {
          window.open(url, '_blank');
        } else if (doc.type?.includes('pdf')) {
          window.open(url, '_blank');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.name;
          a.click();
        }
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      }
    });
  }

  addCost(): void {
    if (!this.viewingSite?.id || !this.newCost.amount || this.newCost.amount <= 0) return;
    this.addingCost = true;
    this.cdr.detectChanges();
    this.siteService.addCost(this.viewingSite.id, this.newCost).subscribe({
      next: (cost) => {
        this.siteCosts.unshift(cost);
        this.newCost = { category: 'Opération', amount: 0, description: '' };
        this.addingCost = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.addingCost = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCost(costId: number): void {
    if (!this.viewingSite?.id) return;
    this.siteService.deleteCost(this.viewingSite.id, costId).subscribe({
      next: () => {
        this.siteCosts = this.siteCosts.filter(c => c.id !== costId);
        this.cdr.detectChanges();
      }
    });
  }

  totalCosts(): number {
    return this.siteCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  }

  calculateBudget(): void {
    this.budgetVisible = true;
    this.cdr.detectChanges();
  }

  // Comparison
  toggleCompareMode(): void {
    this.compareMode = !this.compareMode;
    if (!this.compareMode) {
      this.selectedForCompare = [];
    }
    this.cdr.detectChanges();
  }

  toggleSelectForCompare(site: Site, event: Event): void {
    event.stopPropagation();
    const idx = this.selectedForCompare.findIndex(s => s.id === site.id);
    if (idx >= 0) {
      this.selectedForCompare.splice(idx, 1);
    } else if (this.selectedForCompare.length < 4) {
      this.selectedForCompare.push(site);
    }
    this.cdr.detectChanges();
  }

  isSelectedForCompare(site: Site): boolean {
    return this.selectedForCompare.some(s => s.id === site.id);
  }

  openCompare(): void {
    if (this.selectedForCompare.length < 2) return;
    this.comparingSites = [...this.selectedForCompare];
    this.compareMode = false;
    this.selectedForCompare = [];
    this.cdr.detectChanges();
  }

  closeCompare(): void {
    this.comparingSites = null;
  }

  compareSummary(): string[] {
    if (!this.comparingSites || this.comparingSites.length < 2) return [];
    const s = this.comparingSites;
    const lines: string[] = [];

    // Capacité
    const maxCap = Math.max(...s.map(x => x.capacity || 0));
    const minCap = Math.min(...s.map(x => x.capacity || 0));
    if (maxCap > minCap) {
      const maxSite = s.find(x => (x.capacity || 0) === maxCap)!;
      const pct = minCap > 0 ? Math.round(((maxCap - minCap) / minCap) * 100) : 0;
      lines.push(`**Capacité** — ${maxSite.name} a la plus grande capacité avec **${maxCap.toLocaleString()} t/j**, soit **${pct}% de plus** que le plus petit.`);
    } else {
      lines.push(`**Capacité** — Tous les sites ont une capacité identique de **${maxCap.toLocaleString()} t/j**.`);
    }

    // Production
    const maxProd = Math.max(...s.map(x => x.currentProduction || 0));
    const minProd = Math.min(...s.map(x => x.currentProduction || 0));
    if (maxProd > minProd) {
      const maxSite = s.find(x => (x.currentProduction || 0) === maxProd)!;
      const minSite = s.find(x => (x.currentProduction || 0) === minProd)!;
      lines.push(`**Production** — ${maxSite.name} produit le plus (**${maxProd.toLocaleString()} t/j**), tandis que ${minSite.name} produit le moins (**${minProd.toLocaleString()} t/j**).`);
    } else {
      lines.push(`**Production** — Tous les sites produisent **${maxProd.toLocaleString()} t/j**.`);
    }

    // Utilisation
    const maxUtil = Math.max(...s.map(x => x.capacity ? ((x.currentProduction || 0) / x.capacity) * 100 : 0));
    const minUtil = Math.min(...s.map(x => x.capacity ? ((x.currentProduction || 0) / x.capacity) * 100 : 0));
    const maxUtilSite = s.find(x => x.capacity && ((x.currentProduction || 0) / x.capacity) * 100 === maxUtil)!;
    const minUtilSite = s.find(x => x.capacity && ((x.currentProduction || 0) / x.capacity) * 100 === minUtil)!;
    if (maxUtil > minUtil) {
      lines.push(`**Utilisation** — ${maxUtilSite.name} est le plus utilisé à **${Math.round(maxUtil)}%**, contre **${Math.round(minUtil)}%** pour ${minUtilSite.name}.`);
    }

    // Ouvriers
    const maxW = Math.max(...s.map(x => x.workers || 0));
    const minW = Math.min(...s.map(x => x.workers || 0));
    if (maxW > minW) {
      const maxSite = s.find(x => (x.workers || 0) === maxW)!;
      lines.push(`**Ouvriers** — ${maxSite.name} emploie le plus d'ouvriers (**${maxW}**).`);
    }

    return lines;
  }

  viewHistory(site: Site): void {
    this.historyLoading = true;
    this.viewingSite = site;
    this.viewingHistory = [];
    this.cdr.detectChanges();
    this.siteService.getHistory(site.id!).subscribe({
      next: (logs) => {
        this.viewingHistory = logs;
        this.historyLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.historyLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeHistory(): void {
    this.viewingHistory = [];
    this.viewingSite = null;
  }

  confirmDelete(site: Site): void {
    this.siteToDelete = site;
  }

  cancelDelete(): void {
    this.siteToDelete = null;
  }

  deleteSite(): void {
    if (!this.siteToDelete) return;
    this.deleting = true;
    this.cdr.detectChanges();
    this.siteService.delete(this.siteToDelete.id!).subscribe({
      next: () => {
        this.siteToDelete = null;
        this.deleting = false;
        this.cdr.detectChanges();
        this.siteService.clearCache();
        const pageToLoad = this.currentPage > 0 && this.filteredSites.length <= 1
          ? this.currentPage - 1
          : this.currentPage;
        this.loadPage(pageToLoad);
      },
      error: (err) => {
        this.error = err.error?.message || err.message || 'Erreur de suppression. Le site est peut-être lié à d\'autres données.';
        this.siteToDelete = null;
        this.deleting = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPage(page = 0): void {
    this.loading = true;
    this.currentPage = page;
    this.siteService.getAll(page, this.pageSize).subscribe({
      next: (res) => {
        this.page = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.siteService.clearCache();
    this.loadPage(0);
  }

  applyFilters(): void {
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filterRegion = '';
    this.filterMineral = '';
    this.filterCapacityMin = null;
    this.searchText = '';
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.cdr.detectChanges();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.cdr.detectChanges();
  }

  get filteredSites(): Site[] {
    if (!this.page) return [];
    let result = this.page.content;

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.mineral.toLowerCase().includes(q)
      );
    }

    if (this.filterStatus) {
      result = result.filter(s => s.status?.toLowerCase() === this.filterStatus.toLowerCase());
    }

    if (this.filterRegion) {
      result = result.filter(s => s.region === this.filterRegion);
    }

    if (this.filterMineral) {
      result = result.filter(s => s.mineral === this.filterMineral);
    }

    if (this.filterCapacityMin !== null && this.filterCapacityMin > 0) {
      result = result.filter(s => (s.capacity || 0) >= this.filterCapacityMin!);
    }

    if (this.sortColumn) {
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        const valA = (a as any)[this.sortColumn] || '';
        const valB = (b as any)[this.sortColumn] || '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA).localeCompare(String(valB)) * dir;
      });
    }

    return result;
  }

  get stats() {
    const sites = this.page?.content || [];
    const total = sites.length;
    const active = sites.filter(s => s.status === 'ACTIVE').length;
    const totalWorkers = sites.reduce((sum, s) => sum + (s.workers || 0), 0);
    const totalCapacity = sites.reduce((sum, s) => sum + (s.capacity || 0), 0);
    return { total, active, totalWorkers, totalCapacity };
  }
}
