import Link from "next/link";

import { menuGestion } from "@/lib/navigation/menus";

export function GestionSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/30 md:block">
      <nav className="flex flex-col gap-2 p-4">
        {menuGestion.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href!}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.libelle}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
