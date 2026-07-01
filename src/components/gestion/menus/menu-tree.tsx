import { MenuItemHierarchique } from "@/services/menu-item.service";

import { MenuTreeItem } from "./menu-tree-item";

interface Props {
  items: MenuItemHierarchique[];
}

export function MenuTree({ items }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <MenuTreeItem key={item.id} item={item} />
      ))}
    </div>
  );
}
