"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DataTableColumnHeaderProps {
  title: string;
  sortKey: string;

  currentSort?: string;
  currentOrder?: "asc" | "desc";
}

export function DataTableColumnHeader({
  title,
  sortKey,
  currentSort,
  currentOrder,
}: DataTableColumnHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const handleClick = () => {
    const query = new URLSearchParams(params.toString());

    const isCurrent = currentSort === sortKey;

    const nextOrder = isCurrent && currentOrder === "asc" ? "desc" : "asc";

    query.set("sort", sortKey);
    query.set("order", nextOrder);

    router.push(`${pathname}?${query.toString()}`);
  };

  const icon =
    currentSort !== sortKey ? (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    ) : currentOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="h-auto p-0 font-semibold"
    >
      {title}
      {icon}
    </Button>
  );
}
