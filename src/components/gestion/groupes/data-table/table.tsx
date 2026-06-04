"use client";

import { DataTable } from "@/components/data-table";

import { GroupeRecherche } from "@/services/groupe.service";

import { getGroupeColumns } from "./columns";

type Props = {
  groupes: GroupeRecherche[];
  sort: string;
  order: "asc" | "desc";
};

export function GroupesTable({ groupes, sort, order }: Props) {
  const columns = getGroupeColumns(sort, order);

  return <DataTable data={groupes} columns={columns} />;
}
