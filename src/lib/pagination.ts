export interface ResultatPagine<T> {
  elements: T[];

  total: number;

  page: number;

  pageSize: number;

  pageCount: number;
}
