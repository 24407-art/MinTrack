export interface AuditLog {
  id: number;
  siteId: number;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  username: string;
  timestamp: string;
}
