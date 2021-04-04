export interface PaginatedResponse<TData> {
  data: Array<TData>;
  total: number;
}
