import { arrayMove } from "@dnd-kit/sortable";

export function reorderIds(ids: string[], activeId: string, overId: string) {
  const oldIndex = ids.indexOf(activeId);

  const newIndex = ids.indexOf(overId);

  if (oldIndex === -1 || newIndex === -1) {
    return ids;
  }

  return arrayMove(ids, oldIndex, newIndex);
}
