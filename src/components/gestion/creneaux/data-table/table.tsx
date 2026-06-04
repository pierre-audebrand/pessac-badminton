"use client";

import { DataTable } from "@/components/data-table";

import { CreneauRecherche } from "@/services/creneau.service";

import { getCreneauColumns } from "./columns";

type Props = {
  creneaux: CreneauRecherche[];
  sort: string;
  order: "asc" | "desc";
};

export function CreneauxTable({ creneaux, sort, order }: Props) {
  const columns = getCreneauColumns(sort, order);

  return <DataTable data={creneaux} columns={columns} />;
}
