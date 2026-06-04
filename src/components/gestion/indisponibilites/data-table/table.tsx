"use client";

import { DataTable } from "@/components/data-table";

import { IndisponibiliteRecherche } from "@/services/indisponibilite.service";

import { getIndisponibiliteColumns } from "./columns";

type Props = {
  indisponibilites: IndisponibiliteRecherche[];
  sort: string;
  order: "asc" | "desc";
};

export function IndisponibilitesTable({
  indisponibilites,
  sort,
  order,
}: Props) {
  const columns = getIndisponibiliteColumns(sort, order);

  return <DataTable data={indisponibilites} columns={columns} />;
}
