import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import type { UtilisateurRecherche } from "@/services/utilisateur.service";
import { UtilisateurActions } from "./actions";
import { formaterDate } from "@/lib/dates";
import { calculerAge } from "@/lib/utilisateurs";

export function getUtilisateurColumns(
  utilisateurConnecteId: string,
  currentSort?: string,
  currentOrder?: "asc" | "desc",
): ColumnDef<UtilisateurRecherche>[] {
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

      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.prenom} {row.original.nom}
        </div>
      ),
    },

    {
      id: "age",

      header: "Âge",

      cell: ({ row }) => {
        const dateNaissance = row.original.dateNaissance;

        if (!dateNaissance) {
          return "-";
        }

        return (
          <span className="text-sm">
            {calculerAge(dateNaissance)} ans ({formaterDate(dateNaissance)})
          </span>
        );
      },
    },

    {
      accessorKey: "email",

      header: () => (
        <DataTableColumnHeader
          title="Email"
          sortKey="email"
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
          <Badge>Actif</Badge>
        ) : (
          <Badge variant="secondary">Inactif</Badge>
        ),
    },

    {
      id: "roles",

      header: "Rôles",

      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.roles.map((roleUtilisateur) => (
            <Badge key={roleUtilisateur.role.id} variant="outline">
              {roleUtilisateur.role.nom}
            </Badge>
          ))}
        </div>
      ),
    },

    {
      id: "groupes",

      header: "Groupes",

      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.groupes.map((utilisateurGroupe) => (
            <Badge key={utilisateurGroupe.groupe.id}>
              {utilisateurGroupe.groupe.nom}
            </Badge>
          ))}
        </div>
      ),
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

      cell: ({ row }) => (
        <UtilisateurActions
          utilisateur={row.original}
          utilisateurConnecteId={utilisateurConnecteId}
        />
      ),
    },
  ];
}
