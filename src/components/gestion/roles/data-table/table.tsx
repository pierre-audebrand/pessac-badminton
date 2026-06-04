"use client";

import { DataTable } from "@/components/data-table";

import { RoleRecherche } from "@/services/role.service";

import { getRoleColumns } from "./columns";

interface Props {
  roles: RoleRecherche[];
  sort: string;
  order: "asc" | "desc";
}

export function RolesTable({ roles, sort, order }: Props) {
  const columns = getRoleColumns(sort, order);

  return <DataTable data={roles} columns={columns} />;
}
