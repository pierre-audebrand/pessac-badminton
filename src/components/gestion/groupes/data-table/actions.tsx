"use client";

import { Routes } from "@/lib/routes";

import { GroupeRecherche } from "@/services/groupe.service";

import {
  EntityContainer,
  EntityEditAction,
  EntityToggleAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { modifierActivationGroupeAction } from "@/actions/groupe.actions";

interface Props {
  groupe: GroupeRecherche;
}

export function GroupeActions({ groupe }: Props) {
  return (
    <EntityContainer>
      <EntityToggleAction
        active={groupe.actif}
        activateAction={modifierActivationGroupeAction.bind(
          null,
          groupe.id,
          true,
        )}
        deactivateAction={modifierActivationGroupeAction.bind(
          null,
          groupe.id,
          false,
        )}
      />

      <EntityViewAction href={Routes.groupe(groupe.id)} />

      <EntityEditAction href={Routes.modifierGroupe(groupe.id)} />
    </EntityContainer>
  );
}
