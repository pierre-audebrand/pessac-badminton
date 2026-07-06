import { Badge } from "@/components/ui/badge";
import { menus } from "@/lib/menus";
import { Menu } from "@prisma/client";

export function MenuBadge({ menu }: { menu: Menu }) {
  const menuData = menus[menu];

  return <Badge variant={menuData.variant}>{menuData.libelle}</Badge>;
}
