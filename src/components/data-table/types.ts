import { ColumnDef } from "@tanstack/react-table";

export type SortOrder = "asc" | "desc";

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
}
