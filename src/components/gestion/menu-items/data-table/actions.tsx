"use client";

import {
  modifierActivationMenuItemAction,
  supprimerMenuItemAction,
} from "@/actions/menu-item.actions";

import {
  EntityContainer,
  EntityDeleteAction,
  EntityEditAction,
  EntityToggleAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { Routes } from "@/lib/routes";

import { MenuItemRecherche } from "@/services/menu-item.service";

import { Eye, EyeOff } from "lucide-react";

interface Props {
  menuItem: MenuItemRecherche;
}

export function MenuItemActions({ menuItem }: Props) {
  return (
    <EntityContainer>
      <EntityDeleteAction
        titre={`Supprimer "${menuItem.libelle}"`}
        description={`Êtes-vous sûr de vouloir supprimer "${menuItem.libelle}" ?`}
        formAction={supprimerMenuItemAction.bind(null, menuItem.id)}
      />

      <EntityToggleAction
        active={menuItem.actif}
        activateAction={modifierActivationMenuItemAction.bind(
          null,
          menuItem.id,
          true,
        )}
        deactivateAction={modifierActivationMenuItemAction.bind(
          null,
          menuItem.id,
          false,
        )}
      />

      <EntityViewAction href={Routes.menuItem(menuItem.id)} />

      <EntityEditAction href={Routes.modifierMenuItem(menuItem.id)} />
    </EntityContainer>
  );
}
