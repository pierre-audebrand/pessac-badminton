import Link from "next/link";

import { Plus } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { lireListeQuery, type SearchParams } from "@/lib/liste-query";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  menuItemSortableFields,
  rechercherMenuItems,
} from "@/services/menu-item.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { MenuItemCard } from "@/components/gestion/menu-items/data-table/card";
import { MenuItemsTable } from "@/components/gestion/menu-items/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function MenuItemsPage({ searchParams }: Props) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: menuItemSortableFields,
    defaultSort: "ordre",
  });

  const { elements: menuItems, pageCount } = await rechercherMenuItems({
    page,
    pageSize: 20,
    q,
    sort,
    order,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Éléments de menu</h1>

          <p className="text-muted-foreground">
            Gérez les éléments de navigation du site.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher un élément..." />

          <Button asChild>
            <Link href={Routes.GESTION_MENU_ITEMS_NOUVEAU}>
              <Plus className="h-4 w-4" />
              Nouvel élément
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {menuItems.length === 0 ? (
          <DataTableEmptyState
            title="Aucun élément de menu"
            description="Aucun élément trouvé."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <MenuItemsTable menuItems={menuItems} sort={sort} order={order} />
            </div>

            <div className="space-y-4 md:hidden">
              {menuItems.map((menuItem) => (
                <MenuItemCard key={menuItem.id} menuItem={menuItem} />
              ))}
            </div>
          </>
        )}

        {pageCount > 1 && (
          <DataTablePagination page={page} pageCount={pageCount} />
        )}
      </div>
    </div>
  );
}
