export interface Equipment {
  id?: number;
  name: string;
  type: string;
  model: string;
  serial: string;
  siteId?: number;
  status: string;
  purchaseDate: string;
  lastMaintenance?: string;
  createdAt?: string;
  updatedAt?: string;
}
