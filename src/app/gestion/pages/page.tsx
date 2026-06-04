import Link from "next/link";

import { FilePlus2 } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { lireListeQuery, type SearchParams } from "@/lib/liste-query";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { pageSortableFields, rechercherPages } from "@/services/page.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { PageCard } from "@/components/gestion/pages/data-table/card";
import { PagesTable } from "@/components/gestion/pages/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function PagesPage({ searchParams }: Props) {
  await exigerPermission(Permissions.PAGES_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: pageSortableFields,
    defaultSort: "titre",
  });

  const { elements: pages, pageCount } = await rechercherPages({
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
          <h1 className="text-3xl font-bold">Pages</h1>

          <p className="text-muted-foreground">
            Gérez les pages publiques du site.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher une page..." />

          <Button asChild>
            <Link href={Routes.GESTION_PAGES_NOUVELLE}>
              <FilePlus2 className="h-4 w-4" />
              Nouvelle page
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {pages.length === 0 ? (
          <DataTableEmptyState
            title="Aucune page"
            description="Aucune page trouvée."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <PagesTable pages={pages} sort={sort} order={order} />
            </div>

            <div className="space-y-4 md:hidden">
              {pages.map((page) => (
                <PageCard key={page.id} page={page} />
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
