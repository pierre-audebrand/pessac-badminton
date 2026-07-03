import { MenuItemHierarchique } from "@/services/menu-item.service";

import { MenuTreeNode } from "./menu-tree.types";

export function flattenTree(items: MenuItemHierarchique[]): MenuTreeNode[] {
  const result: MenuTreeNode[] = [];

  function visit(nodes: MenuItemHierarchique[], profondeur: number) {
    for (const node of nodes) {
      const { enfants, ...rest } = node;

      result.push({
        ...rest,
        profondeur,
      });

      visit(enfants, profondeur + 1);
    }
  }

  visit(items, 0);

  return result;
}

export function buildTree(items: MenuTreeNode[]): MenuItemHierarchique[] {
  const roots: MenuItemHierarchique[] = [];

  const stack: MenuItemHierarchique[] = [];

  for (const item of items) {
    const node: MenuItemHierarchique = {
      ...item,
      enfants: [],
    };

    while (stack.length > item.profondeur) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack.at(-1)!.enfants.push(node);
    }

    stack.push(node);
  }

  return roots;
}
