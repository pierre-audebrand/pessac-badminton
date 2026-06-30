import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "@/components/data-table";

import { MenuItemRecherche } from "@/services/menu-item.service";

import { MenuItemActions } from "./actions";
import { MenuBadge } from "@/components/gestion/menu-items/menu-badge";
import { TypeMenuItemBadge } from "@/components/gestion/menu-items/type-badge";

export function getMenuItemColumns(
  sort: string,
  order: "asc" | "desc",
): ColumnDef<MenuItemRecherche>[] {
  return [
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

      cell: ({ row }) => (
        <div className="font-medium">{row.original.libelle}</div>
      ),
    },

    {
      accessorKey: "menu",

      header: () => (
        <DataTableColumnHeader
          title="Menu"
          sortKey="menu"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => <MenuBadge menu={row.original.menu} />,
    },

    {
      accessorKey: "type",

      header: () => (
        <DataTableColumnHeader
          title="Type"
          sortKey="type"
          currentSort={sort}
          currentOrder={order}
        />
      ),

      cell: ({ row }) => <TypeMenuItemBadge type={row.original.type} />,
    },

    {
      id: "cible",

      header: "Cible",

      cell: ({ row }) => row.original.page?.titre ?? row.original.url ?? "-",
    },

    {
      accessorKey: "ordre",

      header: () => (
        <DataTableColumnHeader
          title="Ordre"
          sortKey="ordre"
          currentSort={sort}
          currentOrder={order}
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
      id: "actions",

      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => <MenuItemActions menuItem={row.original} />,
    },
  ];
}
