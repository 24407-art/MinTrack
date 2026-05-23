export interface DashboardStats {
  production: { daily: number; change: number };
  equipment: { active: number; total: number; change: number };
  personnel: { total: number; change: number };
  incidents: { open: number; change: number };
  sites: { active: number; total: number };
}

export interface ProductionChartEntry {
  date: string;
  tonnes: number;
}

export interface RecentIncident {
  id: number;
  title: string;
  status: string;
  date: string;
  siteName: string | null;
}

export interface EquipmentStatusEntry {
  name: string;
  type: string;
  status: string;
  model: string;
}

export interface ShiftEntry {
  id: number;
  name: string;
  time: string;
  status: string;
  workers: number;
}

export interface DashboardData {
  stats: DashboardStats;
  productionChart: ProductionChartEntry[];
  recentIncidents: RecentIncident[];
  equipmentStatus: EquipmentStatusEntry[];
  shifts: ShiftEntry[];
}
