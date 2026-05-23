export interface Production {
  id?: number;
  siteId?: number;
  date: string;
  target?: number;
  actual?: number;
  unit: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}
