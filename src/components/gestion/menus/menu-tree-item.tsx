import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

import { MenuItemHierarchique } from "@/services/menu-item.service";

import { MenuTree } from "./menu-tree";
import { MenuTreeActions } from "./menu-tree-actions";
import { MenuBadge } from "../menu-items/badges/menu-badge";
import { TypeBadge } from "../menu-items/badges/type-badge";

interface Props {
  item: MenuItemHierarchique;
}

export function MenuTreeItem({ item }: Props) {
  return (
    <div className="space-y-2">
      <Card className="p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.libelle}</span>

                <MenuBadge menu={item.menu} />

                <TypeBadge type={item.type} />

                {!item.actif && (
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">
                    Inactif
                  </span>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {item.type === "PAGE" && item.page?.titre}

                {item.type === "URL" && item.url}

                {item.type === "GROUPE" && "Groupe"}
              </div>
            </div>
          </div>

          <MenuTreeActions menuItem={item} />
        </div>
      </Card>

      {item.enfants.length > 0 && (
        <div className="ml-8 border-l pl-4">
          <MenuTree items={item.enfants} />
        </div>
      )}
    </div>
  );
}
