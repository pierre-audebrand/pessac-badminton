import { MenuItemTreeUpdate } from "./menu-tree.updates";

export function diffMenuItemUpdates(
  before: MenuItemTreeUpdate[],
  after: MenuItemTreeUpdate[],
): MenuItemTreeUpdate[] {
  const previous = new Map(before.map((item) => [item.id, item]));

  return after.filter((item) => {
    const old = previous.get(item.id);

    if (!old) {
      return true;
    }

    return old.parentId !== item.parentId || old.ordre !== item.ordre;
  });
}
