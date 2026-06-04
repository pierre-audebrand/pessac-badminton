"use client";

import { Routes } from "@/lib/routes";

import { GroupeRecherche } from "@/services/groupe.service";

import { EntityContainer } from "@/components/ui/entity-actions/container";
import { EntityToggleAction } from "@/components/ui/entity-actions/toggle-action";
import { EntityViewAction } from "@/components/ui/entity-actions/view-action";
import { EntityEditAction } from "@/components/ui/entity-actions/edit-action";
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
