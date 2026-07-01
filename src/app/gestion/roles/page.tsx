import Link from "next/link";

import { ShieldPlus } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { lireListeQuery, type SearchParams } from "@/lib/liste-query";

import { rechercherRoles, roleSortableFields } from "@/services/role.service";

import { Button } from "@/components/ui/button";

import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";

import { RoleCard } from "@/components/gestion/roles/data-table/card";
import { RolesTable } from "@/components/gestion/roles/data-table/table";

type Props = {
  searchParams: SearchParams;
};

export default async function RolesPage({ searchParams }: Props) {
  await exigerPermission(Permissions.ROLES_GERER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: roleSortableFields,
    defaultSort: "nom",
  });

  const { elements: roles, pageCount } = await rechercherRoles({
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
          <h1 className="text-3xl font-bold">Rôles</h1>

          <p className="text-muted-foreground">
            Gestion des rôles et des permissions.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher un rôle..." />

          <Button asChild>
            <Link href={Routes.GESTION_ROLES_CREER}>
              <ShieldPlus className="h-4 w-4" />
              Nouveau rôle
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {roles.length === 0 ? (
          <DataTableEmptyState
            title="Aucun rôle"
            description="Aucun rôle trouvé."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <RolesTable roles={roles} sort={sort} order={order} />
            </div>

            <div className="space-y-4 md:hidden">
              {roles.map((role) => (
                <RoleCard key={role.id} role={role} />
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
