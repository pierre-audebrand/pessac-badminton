import { MenuItemHierarchique } from "@/services/menu-item.service";

import { MenuTreeNode } from "./menu-tree.types";

/* -------------------------------------------------------------------------- */
/*                                  Flatten                                   */
/* -------------------------------------------------------------------------- */

export function flattenTree(
  items: MenuItemHierarchique[],
  profondeur = 0,
): MenuTreeNode[] {
  return items.flatMap((item) => [
    {
      ...item,
      profondeur,
    },
    ...flattenTree(item.enfants, profondeur + 1),
  ]);
}

/* -------------------------------------------------------------------------- */
/*                                   Build                                    */
/* -------------------------------------------------------------------------- */

export function buildTree(items: MenuTreeNode[]): MenuItemHierarchique[] {
  const racines: MenuItemHierarchique[] = [];

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
      racines.push(node);
    } else {
      stack[stack.length - 1].enfants.push(node);
    }

    stack.push(node);
  }

  return racines;
}

/* -------------------------------------------------------------------------- */
/*                                   Indent                                   */
/* -------------------------------------------------------------------------- */

export function indentItem(items: MenuTreeNode[], id: string): MenuTreeNode[] {
  const index = items.findIndex((item) => item.id === id);

  if (!canIndent(items, index)) {
    return items;
  }

  const subtree = getSubtree(items, index);

  const shifted = shiftSubtree(subtree, 1);

  return rebuild(replaceSubtree(items, index, shifted));
}

/* -------------------------------------------------------------------------- */
/*                                  Outdent                                   */
/* -------------------------------------------------------------------------- */

export function outdentItem(items: MenuTreeNode[], id: string): MenuTreeNode[] {
  const index = items.findIndex((item) => item.id === id);

  if (!canOutdent(items, index)) {
    return items;
  }

  const subtree = getSubtree(items, index);

  const shifted = shiftSubtree(subtree, -1);

  return rebuild(replaceSubtree(items, index, shifted));
}

/* -------------------------------------------------------------------------- */
/*                                  Move                                      */
/* -------------------------------------------------------------------------- */

export function moveItem(
  items: MenuTreeNode[],
  activeId: string,
  overId: string,
): MenuTreeNode[] {
  const from = items.findIndex((i) => i.id === activeId);

  const over = items.findIndex((i) => i.id === overId);

  if (from === -1 || over === -1 || from === over) {
    return items;
  }

  const subtree = getSubtree(items, from);

  const remaining = removeRange(items, from, getSubtreeEnd(items, from));

  let target = remaining.findIndex((i) => i.id === overId);

  if (target === -1) {
    target = remaining.length;
  }

  if (from < over) {
    target++;
  }

  return rebuild(insertSubtree(remaining, target, subtree));
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function getSubtreeEnd(items: MenuTreeNode[], startIndex: number) {
  const profondeur = items[startIndex].profondeur;

  let end = startIndex + 1;

  while (end < items.length && items[end].profondeur > profondeur) {
    end++;
  }

  return end;
}

function removeRange<T>(array: T[], start: number, end: number) {
  return [...array.slice(0, start), ...array.slice(end)];
}

function getSubtree(items: MenuTreeNode[], index: number): MenuTreeNode[] {
  return items.slice(index, getSubtreeEnd(items, index));
}

function replaceSubtree(
  items: MenuTreeNode[],
  start: number,
  replacement: MenuTreeNode[],
): MenuTreeNode[] {
  return [
    ...items.slice(0, start),
    ...replacement,
    ...items.slice(getSubtreeEnd(items, start)),
  ];
}

function shiftSubtree(subtree: MenuTreeNode[], delta: number): MenuTreeNode[] {
  return subtree.map((item) => ({
    ...item,
    profondeur: Math.max(0, item.profondeur + delta),
  }));
}

function normalizeDepth(items: MenuTreeNode[]): MenuTreeNode[] {
  if (items.length === 0) {
    return items;
  }

  const normalized: MenuTreeNode[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (i === 0) {
      normalized.push({
        ...item,
        profondeur: 0,
      });

      continue;
    }

    const previous = normalized[i - 1];

    normalized.push({
      ...item,
      profondeur: Math.min(item.profondeur, previous.profondeur + 1),
    });
  }

  return normalized;
}

export function canIndent(items: MenuTreeNode[], index: number): boolean {
  if (index <= 0) {
    return false;
  }

  const current = items[index];
  const previous = items[index - 1];

  return current.profondeur <= previous.profondeur;
}

export function canOutdent(items: MenuTreeNode[], index: number): boolean {
  return items[index].profondeur > 0;
}

function rebuild(items: MenuTreeNode[]): MenuTreeNode[] {
  return flattenTree(buildTree(normalizeDepth(items)));
}

function insertSubtree(
  items: MenuTreeNode[],
  index: number,
  subtree: MenuTreeNode[],
): MenuTreeNode[] {
  return [...items.slice(0, index), ...subtree, ...items.slice(index)];
}
