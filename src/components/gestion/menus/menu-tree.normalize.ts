import { MenuTreeNode } from "./menu-tree.types";

export function normalizeFlatTree(items: MenuTreeNode[]): MenuTreeNode[] {
  if (items.length === 0) {
    return [];
  }

  const normalized: MenuTreeNode[] = [];

  for (let i = 0; i < items.length; i++) {
    const current = items[i];

    if (i === 0) {
      normalized.push({
        ...current,
        profondeur: 0,
      });

      continue;
    }

    const previous = normalized[i - 1];

    normalized.push({
      ...current,
      profondeur: Math.max(
        0,
        Math.min(current.profondeur, previous.profondeur + 1),
      ),
    });
  }

  return normalized;
}
