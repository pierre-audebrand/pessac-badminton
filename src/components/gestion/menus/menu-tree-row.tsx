"use client";

import { Card } from "@/components/ui/card";

import { MenuTreeNode } from "./menu-tree.types";
import { MenuTreeActions } from "./menu-tree-actions";
import { MenuBadge } from "../menu-items/badges/menu-badge";
import { TypeMenuItemBadge } from "../menu-items/badges/menu-item-type-badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { canIndent, canOutdent } from "./menu-tree.operations";

interface Props {
  item: MenuTreeNode;

  canIndent: boolean;
  canOutdent: boolean;

  onIndent(id: string): void;
  onOutdent(id: string): void;
}

export function MenuTreeRow({ item, onIndent, onOutdent }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className="p-3"
        style={{
          marginLeft: item.profondeur * 32,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Déplacer l'élément"
              className="shrink-0 cursor-grab rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onOutdent(item.id)}
                disabled={!canOutdent}
                className="rounded p-1 hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                title="Diminuer le niveau"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onIndent(item.id)}
                disabled={!canIndent}
                className="rounded p-1 hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                title="Augmenter le niveau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.libelle}</span>

                <MenuBadge menu={item.menu} />

                <TypeMenuItemBadge pageId={item.pageId} url={item.url} />

                {!item.actif && (
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">
                    Inactif
                  </span>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {item.pageId && item.page?.titre}
                {item.url && item.url}
              </div>
            </div>
          </div>

          <MenuTreeActions menuItem={item} />
        </div>
      </Card>
    </div>
  );
}
