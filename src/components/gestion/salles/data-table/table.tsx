"use client";

import { DataTable } from "@/components/data-table";

import { SalleRecherche } from "@/services/salle.service";

import { getSalleColumns } from "./columns";

type Props = {
  salles: SalleRecherche[];
  sort: string;
  order: "asc" | "desc";
};

export function SallesTable({ salles, sort, order }: Props) {
  const columns = getSalleColumns(sort, order);

  return <DataTable data={salles} columns={columns} />;
}
