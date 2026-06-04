import Link from "next/link";

import { CalendarX2 } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { lireListeQuery, type SearchParams } from "@/lib/liste-query";

import {
  rechercherIndisponibilites,
  indisponibiliteSortableFields,
} from "@/services/indisponibilite.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { IndisponibiliteCard } from "@/components/gestion/indisponibilites/data-table/card";
import { IndisponibilitesTable } from "@/components/gestion/indisponibilites/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function IndisponibilitesPage({ searchParams }: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: indisponibiliteSortableFields,
    defaultSort: "debut",
  });

  const { elements: indisponibilites, pageCount } =
    await rechercherIndisponibilites({
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
          <h1 className="text-3xl font-bold">Indisponibilités</h1>

          <p className="text-muted-foreground">
            Gestion des indisponibilités des salles.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher une indisponibilité..." />

          <Button asChild>
            <Link href={Routes.GESTION_INDISPONIBILITES_NOUVELLE}>
              <CalendarX2 className="h-4 w-4" />
              Nouvelle indisponibilité
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {indisponibilites.length === 0 ? (
          <DataTableEmptyState
            title="Aucune indisponibilité"
            description="Aucune indisponibilité trouvée."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <IndisponibilitesTable
                indisponibilites={indisponibilites}
                sort={sort}
                order={order}
              />
            </div>

            <div className="space-y-4 md:hidden">
              {indisponibilites.map((indisponibilite) => (
                <IndisponibiliteCard
                  key={indisponibilite.id}
                  indisponibilite={indisponibilite}
                />
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
