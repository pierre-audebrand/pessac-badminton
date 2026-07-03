"use client";

import { useMemo, useState } from "react";

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
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { MenuItemHierarchique } from "@/services/menu-item.service";

import { buildTree, flattenTree } from "./menu-tree.utils";
import { MenuTreeRow } from "./menu-tree-row";
import { MenuTreeNode } from "./menu-tree.types";

import { normalizeFlatTree } from "./menu-tree.normalize";

interface Props {
  items: MenuItemHierarchique[];
}

export function MenuTreeEditor({ items }: Props) {
  const initialItems = useMemo(() => flattenTree(items), [items]);

  const [flatItems, setFlatItems] = useState<MenuTreeNode[]>(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setFlatItems((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);

      const newIndex = current.findIndex((item) => item.id === over.id);

      const moved = arrayMove(current, oldIndex, newIndex);

      return flattenTree(buildTree(normalizeFlatTree(moved)));
    });
  }

  function handleIndent(id: string) {
    setFlatItems((items) => {
      const next = items.map((item) =>
        item.id === id
          ? {
              ...item,
              profondeur: item.profondeur + 1,
            }
          : item,
      );

      return flattenTree(buildTree(normalizeFlatTree(next)));
    });
  }

  function handleOutdent(id: string) {
    setFlatItems((items) => {
      const next = items.map((item) =>
        item.id === id
          ? {
              ...item,
              profondeur: Math.max(0, item.profondeur - 1),
            }
          : item,
      );

      return flattenTree(buildTree(normalizeFlatTree(next)));
    });
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
        <div className="space-y-2">
          {flatItems.map((item) => (
            <MenuTreeRow
              key={item.id}
              item={item}
              onIndent={handleIndent}
              onOutdent={handleOutdent}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
