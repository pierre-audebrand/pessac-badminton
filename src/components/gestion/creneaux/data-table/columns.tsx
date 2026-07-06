import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import { joursSemaine } from "@/lib/jours-semaine";

import { CreneauRecherche } from "@/services/creneau.service";

import { CreneauActions } from "./actions";
import { typesCreneau } from "@/lib/types-creneau";
import { getContrastColor } from "@/lib/colors";

export function getCreneauColumns(
  currentSort?: string,
  currentOrder?: "asc" | "desc",
): ColumnDef<CreneauRecherche>[] {
  return [
    {
      accessorKey: "jourSemaine",

      header: () => (
        <DataTableColumnHeader
          title="Jour"
          sortKey="jourSemaine"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),

      cell: ({ row }) => joursSemaine[row.original.jourSemaine].libelle,
    },

    {
      id: "salle",

      header: () => (
        <DataTableColumnHeader
          title="Salle"
          sortKey="salle"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),

      cell: ({ row }) => row.original.salle.nom,
    },

    {
      accessorKey: "heureDebut",

      header: () => (
        <DataTableColumnHeader
          title="Début"
          sortKey="heureDebut"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),
    },

    {
      accessorKey: "heureFin",

      header: () => (
        <DataTableColumnHeader
          title="Fin"
          sortKey="heureFin"
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      ),
    },

    {
      accessorKey: "type",

      header: "Type",

      cell: ({ row }) =>
        row.original.type ? (
          <Badge variant="outline">
            {typesCreneau[row.original.type].libelle}
          </Badge>
        ) : (
          <span className="text-muted-foreground">Non défini</span>
        ),
    },

    {
      id: "groupes",

      header: "Groupes",

      cell: ({ row }) =>
        row.original.groupes.length === 0 ? (
          <span className="text-muted-foreground">Aucun</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {row.original.groupes.map(({ groupe }) => (
              <Badge
                key={groupe.id}
                variant="outline"
                style={{
                  backgroundColor: groupe.couleur ?? undefined,
                  borderColor: groupe.couleur ?? undefined,
                  color: groupe.couleur
                    ? getContrastColor(groupe.couleur)
                    : undefined,
                }}
              >
                {groupe.nom}
              </Badge>
            ))}
          </div>
        ),
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
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => <CreneauActions creneau={row.original} />,
    },
  ];
}
