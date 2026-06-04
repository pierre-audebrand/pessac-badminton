"use client";

import { DataTable } from "@/components/data-table";

import { getUtilisateurColumns } from "./columns";
import { UtilisateurRecherche } from "@/services/utilisateur.service";

type Props = {
  utilisateurs: UtilisateurRecherche[];
  utilisateurConnecteId: string;
  sort: string;
  order: "asc" | "desc";
};

export function UtilisateursTable({
  utilisateurs,
  utilisateurConnecteId,
  sort,
  order,
}: Props) {
  const columns = getUtilisateurColumns(utilisateurConnecteId, sort, order);

  return <DataTable data={utilisateurs} columns={columns} />;
}
