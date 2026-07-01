import Link from "next/link";

import { Users } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { lireListeQuery, type SearchParams } from "@/lib/liste-query";

import {
  groupeSortableFields,
  rechercherGroupes,
} from "@/services/groupe.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { GroupeCard } from "@/components/gestion/groupes/data-table/card";
import { GroupesTable } from "@/components/gestion/groupes/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function GroupesPage({ searchParams }: Props) {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: groupeSortableFields,
    defaultSort: "nom",
  });

  const { elements: groupes, pageCount } = await rechercherGroupes({
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
          <h1 className="text-3xl font-bold">Groupes</h1>

          <p className="text-muted-foreground">Gestion des groupes du club.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher un groupe..." />

          <Button asChild>
            <Link href={Routes.GESTION_GROUPES_CREER}>
              <Users className="h-4 w-4" />
              Nouveau groupe
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {groupes.length === 0 ? (
          <DataTableEmptyState
            title="Aucun groupe"
            description="Aucun groupe trouvé."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <GroupesTable groupes={groupes} sort={sort} order={order} />
            </div>

            <div className="space-y-4 md:hidden">
              {groupes.map((groupe) => (
                <GroupeCard key={groupe.id} groupe={groupe} />
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
