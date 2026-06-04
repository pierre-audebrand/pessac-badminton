import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import { PageRecherche } from "@/services/page.service";

import { PageActions } from "./actions";

export function getPageColumns(
  sort: string,
  order: "asc" | "desc",
): ColumnDef<PageRecherche>[] {
  return [
    {
      accessorKey: "titre",

      header: () => (
        <DataTableColumnHeader
          title="Titre"
          sortKey="titre"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => (
        <div className="font-medium">{row.original.titre}</div>
      ),
    },

    {
      accessorKey: "chemin",

      header: "Chemin",

      cell: ({ row }) => (
        <code className="text-sm">/{row.original.chemin}</code>
      ),
    },

    {
      accessorKey: "publiee",

      header: "Statut",

      cell: ({ row }) =>
        row.original.publiee ? (
          <Badge>Publiée</Badge>
        ) : (
          <Badge variant="secondary">Brouillon</Badge>
        ),
    },

    {
      accessorKey: "updatedAt",

      header: () => (
        <DataTableColumnHeader
          title="Modification"
          sortKey="updatedAt"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => row.original.updatedAt.toLocaleDateString("fr-FR"),
    },

    {
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => <PageActions page={row.original} />,
    },
  ];
}
