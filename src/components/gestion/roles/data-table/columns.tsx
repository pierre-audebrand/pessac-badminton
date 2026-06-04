import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import { RoleRecherche } from "@/services/role.service";

import { RoleActions } from "./actions";

export function getRoleColumns(
  sort: string,
  order: "asc" | "desc",
): ColumnDef<RoleRecherche>[] {
  return [
    {
      accessorKey: "nom",

      header: () => (
        <DataTableColumnHeader
          title="Nom"
          sortKey="nom"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.nom}</span>

          {row.original.systeme && <Badge variant="secondary">Système</Badge>}
        </div>
      ),
    },

    {
      accessorKey: "description",

      header: "Description",

      cell: ({ row }) => row.original.description ?? "-",
    },

    {
      id: "permissions",

      header: "Permissions",

      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.permissions.map((rolePermission) => (
            <Badge key={rolePermission.permission.id} variant="outline">
              {rolePermission.permission.libelle}
            </Badge>
          ))}
        </div>
      ),
    },

    {
      id: "utilisateurs",

      header: "Utilisateurs",

      cell: ({ row }) => row.original._count.utilisateurs,
    },

    {
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => <RoleActions role={row.original} />,
    },
  ];
}
