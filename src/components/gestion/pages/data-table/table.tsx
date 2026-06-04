"use client";

import { DataTable } from "@/components/data-table";

import { PageRecherche } from "@/services/page.service";

import { getPageColumns } from "./columns";

interface Props {
  pages: PageRecherche[];
  sort: string;
  order: "asc" | "desc";
}

export function PagesTable({ pages, sort, order }: Props) {
  const columns = getPageColumns(sort, order);

  return <DataTable data={pages} columns={columns} />;
}
