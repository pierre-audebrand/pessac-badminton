import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import type { PermissionRecherche } from "@/services/permission.service";

export function getPermissionColumns(
  sort: string,
  order: "asc" | "desc",
): ColumnDef<PermissionRecherche>[] {
  return [
    {
      accessorKey: "code",

      header: () => (
        <DataTableColumnHeader
          title="Code"
          sortKey="code"
          currentSort={sort}
          currentOrder={order}
        />
      ),
    },

    {
      accessorKey: "libelle",

      header: () => (
        <DataTableColumnHeader
          title="Libellé"
          sortKey="libelle"
          currentSort={sort}
          currentOrder={order}
        />
      ),
    },

    {
      accessorKey: "description",

      header: "Description",

      cell: ({ row }) => row.original.description ?? "-",
    },

    {
      id: "roles",

      header: "Rôles",

      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.roles.map((rolePermission) => (
            <Badge key={rolePermission.role.id} variant="outline">
              {rolePermission.role.nom}
            </Badge>
          ))}
        </div>
      ),
    },
  ];
}
