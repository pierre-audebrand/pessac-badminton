import { MenuItemHierarchique } from "@/services/menu-item.service";

export interface MenuTreeNode extends Omit<MenuItemHierarchique, "enfants"> {
  profondeur: number;
}
