import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table";

import { formaterDateHeure } from "@/lib/dates";

import { IndisponibiliteRecherche } from "@/services/indisponibilite.service";

import { IndisponibiliteActions } from "./actions";

export function getIndisponibiliteColumns(
  sort: string,
  order: "asc" | "desc",
): ColumnDef<IndisponibiliteRecherche>[] {
  return [
    {
      id: "salle",

      header: "Salle",

      cell: ({ row }) => row.original.salle.nom,
    },

    {
      accessorKey: "debut",

      header: () => (
        <DataTableColumnHeader
          title="Début"
          sortKey="debut"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => formaterDateHeure(row.original.debut),
    },

    {
      accessorKey: "fin",

      header: () => (
        <DataTableColumnHeader
          title="Fin"
          sortKey="fin"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => formaterDateHeure(row.original.fin),
    },

    {
      accessorKey: "motif",

      header: "Motif",

      cell: ({ row }) => row.original.motif || "-",
    },

    {
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => (
        <IndisponibiliteActions indisponibilite={row.original} />
      ),
    },
  ];
}
