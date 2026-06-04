import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { lireListeQuery, SearchParams } from "@/lib/liste-query";
import {
  permissionSortableFields,
  rechercherPermissions,
} from "@/services/permission.service";
import {
  DataTableEmptyState,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { PermissionsTable } from "@/components/gestion/permissions/table";
import { PermissionCard } from "@/components/gestion/permissions/card";

type Props = {
  searchParams: SearchParams;
};

export default async function PermissionsPage({ searchParams }: Props) {
  await exigerPermission(Permissions.PERMISSIONS_CONSULTER.code);

  const params = await searchParams;

  const { page, q, sort, order } = lireListeQuery(params, {
    sortableFields: permissionSortableFields,
    defaultSort: "code",
  });

  const { elements: permissions, pageCount } = await rechercherPermissions({
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
          <h1 className="text-3xl font-bold">Permissions</h1>

          <p className="text-muted-foreground">
            {"Liste des permissions disponibles dans l'application."}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DataTableToolbar placeholder="Rechercher une permission..." />
        </div>
      </div>

      <div className="space-y-4">
        {permissions.length === 0 ? (
          <DataTableEmptyState
            title="Aucune permission"
            description="Aucune permission trouvée."
          />
        ) : (
          <>
            <div className="hidden md:block">
              <PermissionsTable
                permissions={permissions}
                sort={sort}
                order={order}
              />
            </div>

            <div className="space-y-4 md:hidden">
              {permissions.map((permission) => (
                <PermissionCard key={permission.id} permission={permission} />
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
