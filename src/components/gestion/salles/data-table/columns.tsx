import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import { SalleRecherche } from "@/services/salle.service";

import { SalleActions } from "./actions";
import { formaterDate } from "@/lib/dates";

export function getSalleColumns(
  currentSort?: string,
  currentOrder?: "asc" | "desc",
): ColumnDef<SalleRecherche>[] {
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
      accessorKey: "ville",

      header: () => (
        <DataTableColumnHeader
          title="Ville"
          sortKey="ville"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),
    },

    {
      accessorKey: "actif",

      header: "Statut",

      cell: ({ row }) =>
        row.original.actif ? (
          <Badge>Active</Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        ),
    },

    {
      id: "creneaux",

      header: "Créneaux",

      cell: ({ row }) => {
        const creneaux = row.original._count.creneaux;

        return creneaux === 0 ? "-" : creneaux;
      },
    },

    {
      id: "indisponibilites",

      header: "Indisponibilités",

      cell: ({ row }) => {
        const indispos = row.original.indisponibilites;

        if (indispos.length === 0) {
          return "-";
        }

        return (
          <div className="flex flex-col gap-1">
            {indispos.slice(0, 2).map((indispo) => (
              <span key={indispo.id} className="text-xs">
                {formaterDate(indispo.debut)}
                {indispo.motif ? ` - ${indispo.motif}` : ""}
              </span>
            ))}

            {indispos.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{indispos.length - 2}
              </span>
            )}
          </div>
        );
      },
    },

    {
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => <SalleActions salle={row.original} />,
    },
  ];
}
