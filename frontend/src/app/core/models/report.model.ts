export interface Report {
  id?: number;
  title: string;
  type: string;
  content: string;
  siteId?: number;
  authorId?: number;
  date: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
