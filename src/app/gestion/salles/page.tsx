import Link from "next/link";

import { Building2 } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { lireListeQuery, type SearchParams } from "@/lib/liste-query";

import {
  rechercherSalles,
  salleSortableFields,
} from "@/services/salle.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { SalleCard } from "@/components/gestion/salles/data-table/card";
import { SallesTable } from "@/components/gestion/salles/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function SallesPage({ searchParams }: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: salleSortableFields,
    defaultSort: "nom",
  });

  const { elements: salles, pageCount } = await rechercherSalles({
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
          <h1 className="text-3xl font-bold">Salles</h1>

          <p className="text-muted-foreground">Gestion des salles du club.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher une salle..." />

          <Button asChild>
            <Link href={Routes.GESTION_SALLES_CREER}>
              <Building2 className="h-4 w-4" />
              Nouvelle salle
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {salles.length === 0 ? (
          <DataTableEmptyState
            title="Aucune salle"
            description="Aucune salle trouvée."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <SallesTable salles={salles} sort={sort} order={order} />
            </div>

            <div className="space-y-4 md:hidden">
              {salles.map((salle) => (
                <SalleCard key={salle.id} salle={salle} />
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
