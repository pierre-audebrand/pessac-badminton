"use client";

import { useMemo, useRef, useState, useTransition } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { MenuItemHierarchique } from "@/services/menu-item.service";

import { MenuTreeRow } from "./menu-tree-row";
import { MenuTreeNode } from "./menu-tree.types";

import {
  flattenTree,
  indentItem,
  outdentItem,
  moveItem,
  canIndent,
  canOutdent,
} from "./menu-tree.operations";
import { buildMenuItemUpdates } from "./menu-tree.updates";
import { reordonnerMenuItemsAction } from "@/actions/menu-item.actions";
import { Button } from "@/components/ui/button";
import { diffMenuItemUpdates } from "./menu-tree.diff";

interface Props {
  items: MenuItemHierarchique[];
}

export function MenuTreeEditor({ items }: Props) {
  const [isPending, startTransition] = useTransition();

  const [dirty, setDirty] = useState(false);

  const initialFlatItems = useMemo(() => flattenTree(items), [items]);

  const initialFlatItemsRef = useRef(initialFlatItems);

  const [flatItems, setFlatItems] = useState(initialFlatItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  function updateTree(updater: (items: MenuTreeNode[]) => MenuTreeNode[]) {
    setFlatItems((items) => updater(items));
    setDirty(true);
  }

  function handleSave() {
    startTransition(async () => {
      const before = buildMenuItemUpdates(initialFlatItemsRef.current);

      const after = buildMenuItemUpdates(flatItems);

      const updates = diffMenuItemUpdates(before, after);

      if (updates.length === 0) {
        setDirty(false);
        return;
      }

      await reordonnerMenuItemsAction(updates);

      initialFlatItemsRef.current = flatItems;

      setDirty(false);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    updateTree((items) => moveItem(items, String(active.id), String(over.id)));
  }

  function handleIndent(id: string) {
    updateTree((items) => indentItem(items, id));
  }

  function handleOutdent(id: string) {
    updateTree((items) => outdentItem(items, id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={flatItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex justify-end gap-2">
          {dirty && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFlatItems(initialFlatItemsRef.current);
                  setDirty(false);
                }}
              >
                Réinitialiser
              </Button>

              <Button onClick={handleSave} disabled={isPending}>
                {isPending
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </Button>
            </>
          )}
        </div>

        <div className="space-y-2">
          {flatItems.map((item, index) => (
            <MenuTreeRow
              key={item.id}
              item={item}
              canIndent={canIndent(flatItems, index)}
              canOutdent={canOutdent(flatItems, index)}
              onIndent={handleIndent}
              onOutdent={handleOutdent}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
