export interface PageResponse<T> {
  content: T[];
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
}
