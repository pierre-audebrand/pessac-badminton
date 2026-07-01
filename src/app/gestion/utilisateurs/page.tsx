import Link from "next/link";

import { exigerPermission } from "@/lib/autorisations";
import { obtenirUtilisateurConnecte } from "@/lib/authentification";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  rechercherUtilisateurs,
  utilisateurSortableFields,
} from "@/services/utilisateur.service";

import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { UtilisateurCard } from "@/components/gestion/utilisateurs/data-table/card";
import { UtilisateursTable } from "@/components/gestion/utilisateurs/data-table/table";
import { lireListeQuery, SearchParams } from "@/lib/liste-query";

type PageProps = {
  searchParams: SearchParams;
};

export default async function UtilisateursPage({ searchParams }: PageProps) {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const utilisateurConnecte = await obtenirUtilisateurConnecte();

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: utilisateurSortableFields,
    defaultSort: "nom",
  });

  const { elements: utilisateurs, pageCount } = await rechercherUtilisateurs({
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
          <h1 className="text-3xl font-bold">Utilisateurs</h1>

          <p className="text-muted-foreground">
            Gestion des comptes utilisateurs.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher un utilisateur..." />

          <Button asChild>
            <Link href={Routes.GESTION_UTILISATEURS_CREER}>
              <UserPlus className="h-4 w-4" />
              Nouvel utilisateur
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {utilisateurs.length === 0 ? (
          <DataTableEmptyState
            title="Aucun utilisateur"
            description="Aucun utilisateur trouvé."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <UtilisateursTable
                utilisateurs={utilisateurs}
                utilisateurConnecteId={utilisateurConnecte.id}
                sort={sort}
                order={order}
              />
            </div>

            <div className="space-y-4 md:hidden">
              {utilisateurs.map((utilisateur) => (
                <UtilisateurCard
                  key={utilisateur.id}
                  utilisateur={utilisateur}
                  utilisateurConnecteId={utilisateurConnecte.id}
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
