import { MenuTreeNode } from "./menu-tree.types";

export interface MenuItemTreeUpdate {
  id: string;
  parentId: string | null;
  ordre: number;
}

export function buildMenuItemUpdates(
  items: MenuTreeNode[],
): MenuItemTreeUpdate[] {
  const lastNodeAtDepth = new Map<number, string>();

  const counters = new Map<string | null, number>();

  return items.map((item) => {
    const parentId =
      item.profondeur === 0
        ? null
        : (lastNodeAtDepth.get(item.profondeur - 1) ?? null);

    lastNodeAtDepth.set(item.profondeur, item.id);

    for (const depth of lastNodeAtDepth.keys()) {
      if (depth > item.profondeur) {
        lastNodeAtDepth.delete(depth);
      }
    }

    const ordre = counters.get(parentId) ?? 0;

    counters.set(parentId, ordre + 1);

    return {
      id: item.id,
      parentId,
      ordre,
    };
  });
}
