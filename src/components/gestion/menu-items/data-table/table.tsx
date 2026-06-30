"use client";

import { DataTable } from "@/components/data-table";

import { MenuItemRecherche } from "@/services/menu-item.service";

import { getMenuItemColumns } from "./columns";

interface Props {
  menuItems: MenuItemRecherche[];
  sort: string;
  order: "asc" | "desc";
}

export function MenuItemsTable({ menuItems, sort, order }: Props) {
  const columns = getMenuItemColumns(sort, order);

  return <DataTable data={menuItems} columns={columns} />;
}
