export type SortOrder = "asc" | "desc";

interface LireListeQueryOptions<TSort extends string> {
  sortableFields: readonly TSort[];
  defaultSort: TSort;
}

export interface ListeQuery {
  page?: string;
  q?: string;
  sort?: string;
  order?: string;

  [key: string]: string | undefined;
}

export type SearchParams = Promise<ListeQuery>;

export function lireListeQuery<TSort extends string>(
  params: ListeQuery,
  options: LireListeQueryOptions<TSort>,
) {
  const pageValue = Number(params.page);

  const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;

  const q = params.q ?? "";

  const sort = options.sortableFields.includes(params.sort as TSort)
    ? (params.sort as TSort)
    : options.defaultSort;

  const order: SortOrder = params.order === "desc" ? "desc" : "asc";

  return {
    page,
    q,
    sort,
    order,
  };
}
