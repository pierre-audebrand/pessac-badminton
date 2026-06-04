import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import { GroupeRecherche } from "@/services/groupe.service";

import { GroupeActions } from "./actions";
import { formaterDate } from "@/lib/dates";
import { formaterTrancheAge } from "@/lib/groupes";

export function getGroupeColumns(
  currentSort?: string,
  currentOrder?: "asc" | "desc",
): ColumnDef<GroupeRecherche>[] {
  return [
    {
      accessorKey: "nom",

      header: () => (
        <DataTableColumnHeader
          title="Nom"
          sortKey="nom"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),
    },

    {
      id: "ages",

      header: "Âges",

      cell: ({ row }) =>
        formaterTrancheAge(row.original.ageMin, row.original.ageMax),
    },

    {
      accessorKey: "actif",

      header: "Statut",

      cell: ({ row }) =>
        row.original.actif ? (
          <Badge>Actif</Badge>
        ) : (
          <Badge variant="secondary">Inactif</Badge>
        ),
    },

    {
      id: "utilisateurs",

      header: "Utilisateurs",

      cell: ({ row }) => row.original._count.utilisateurs,
    },

    {
      id: "creneaux",

      header: "Créneaux",

      cell: ({ row }) => row.original._count.creneaux,
    },

    {
      accessorKey: "createdAt",

      header: () => (
        <DataTableColumnHeader
          title="Créé le"
          sortKey="createdAt"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),

      cell: ({ row }) => (
        <span className="text-sm">{formaterDate(row.original.createdAt)}</span>
      ),
    },

    {
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => <GroupeActions groupe={row.original} />,
    },
  ];
}
