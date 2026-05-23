export interface Site {
  id?: number;
  name: string;
  code: string;
  mineral: string;
  region: string;
  coordinates: string;
  status: string;
  capacity: number;
  currentProduction: number;
  workers: number;
  equipmentCount: number;
  startDate: string;
  area: string;
  createdAt?: string;
  updatedAt?: string;
}
