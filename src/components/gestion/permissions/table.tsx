"use client";

import { DataTable } from "@/components/data-table";

import { getPermissionColumns } from "./columns";

import type { PermissionRecherche } from "@/services/permission.service";

interface PermissionsTableProps {
  permissions: PermissionRecherche[];
  sort: string;
  order: "asc" | "desc";
}

export function PermissionsTable({
  permissions,
  sort,
  order,
}: PermissionsTableProps) {
  const columns = getPermissionColumns(sort, order);

  return <DataTable data={permissions} columns={columns} />;
}
