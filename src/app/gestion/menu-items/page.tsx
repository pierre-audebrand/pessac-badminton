import Link from "next/link";

import { Plus } from "lucide-react";
import { Menu } from "@prisma/client";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";
import { type SearchParams } from "@/lib/liste-query";

import { recupererArbreMenu } from "@/services/menu-item.service";

import { Button } from "@/components/ui/button";

import { DataTableEmptyState } from "@/components/data-table";

import { MenuSelector } from "@/components/gestion/menus/menu-selector";
import { MenuTree } from "@/components/gestion/menus/menu-tree";
import { lireMenuQuery } from "@/lib/menus";

type Props = {
  searchParams: SearchParams;
};

export default async function MenuItemsPage({ searchParams }: Props) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const params = await searchParams;

  const menu = lireMenuQuery(params.menu);

  const arbre = await recupererArbreMenu(menu);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Menus</h1>

        <p className="text-muted-foreground">
          Organisez les menus de navigation du site.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MenuSelector value={menu} />

        <Button asChild>
          <Link href={`${Routes.GESTION_MENU_ITEMS_CREER}?menu=${menu}`}>
            <Plus className="h-4 w-4" />
            Nouvel élément
          </Link>
        </Button>
      </div>

      {arbre.length === 0 ? (
        <DataTableEmptyState
          title="Aucun élément"
          description="Ce menu ne contient encore aucun élément."
        />
      ) : (
        <MenuTree items={arbre} />
      )}
    </div>
  );
}
