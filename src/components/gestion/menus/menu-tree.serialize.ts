import { MenuTreeNode } from "./menu-tree.types";

export interface MenuTreePersistence {
  id: string;
  parentId: string | null;
  ordre: number;
}

export function serializeTree(items: MenuTreeNode[]): MenuTreePersistence[] {
  const lastParentAtDepth = new Map<number, string>();

  return items.map((item) => {
    const parentId =
      item.profondeur === 0
        ? null
        : (lastParentAtDepth.get(item.profondeur - 1) ?? null);

    lastParentAtDepth.set(item.profondeur, item.id);

    // on oublie les profondeurs plus profondes
    for (const depth of [...lastParentAtDepth.keys()]) {
      if (depth > item.profondeur) {
        lastParentAtDepth.delete(depth);
      }
    }

    return {
      id: item.id,
      parentId,
      ordre: 0, // calculé ensuite
    };
  });
}
