export interface Personnel {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  role: string;
  department: string;
  siteId?: number;
  teamId?: number;
  hireDate: string;
  salary: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
