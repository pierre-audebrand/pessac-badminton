import Link from "next/link";

import { CalendarClock } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { lireListeQuery, type SearchParams } from "@/lib/liste-query";

import {
  rechercherCreneaux,
  creneauSortableFields,
} from "@/services/creneau.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { CreneauCard } from "@/components/gestion/creneaux/data-table/card";
import { CreneauxTable } from "@/components/gestion/creneaux/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function CreneauxPage({ searchParams }: Props) {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: creneauSortableFields,
    defaultSort: "jourSemaine",
  });

  const { elements: creneaux, pageCount } = await rechercherCreneaux({
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
          <h1 className="text-3xl font-bold">Créneaux</h1>

          <p className="text-muted-foreground">Gestion des créneaux du club.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher un créneau..." />

          <Button asChild>
            <Link href={Routes.GESTION_CRENEAUX_CREER}>
              <CalendarClock className="h-4 w-4" />
              Nouveau créneau
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {creneaux.length === 0 ? (
          <DataTableEmptyState
            title="Aucun créneau"
            description="Aucun créneau trouvé."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <CreneauxTable creneaux={creneaux} sort={sort} order={order} />
            </div>

            <div className="space-y-4 md:hidden">
              {creneaux.map((creneau) => (
                <CreneauCard key={creneau.id} creneau={creneau} />
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
