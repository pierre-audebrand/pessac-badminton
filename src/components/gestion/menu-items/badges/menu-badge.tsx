import { Badge } from "@/components/ui/badge";
import { Menu } from "@prisma/client";
import { recupererMenuData } from "@/lib/menus";

export function MenuBadge({ menu }: { menu: Menu }) {
  const menuData = recupererMenuData(menu);

  return <Badge variant={menuData.variant}>{menuData.label}</Badge>;
}
