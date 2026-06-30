"use client";

import { Users } from "lucide-react";

import {
  EntityContainer,
  EntityCustomAction,
  EntityEditAction,
  EntityToggleAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { Routes } from "@/lib/routes";

import { CreneauRecherche } from "@/services/creneau.service";
import { modifierActivationCreneauAction } from "@/actions/creneau.actions";

interface Props {
  creneau: CreneauRecherche;
}

export function CreneauActions({ creneau }: Props) {
  return (
    <EntityContainer>
      <EntityToggleAction
        active={creneau.actif}
        activateAction={modifierActivationCreneauAction.bind(
          null,
          creneau.id,
          true,
        )}
        deactivateAction={modifierActivationCreneauAction.bind(
          null,
          creneau.id,
          false,
        )}
      />

      <EntityCustomAction
        href={Routes.groupesCreneau(creneau.id)}
        icon={Users}
        label="Gérer les groupes"
      />

      <EntityViewAction href={Routes.creneau(creneau.id)} />

      <EntityEditAction href={Routes.modifierCreneau(creneau.id)} />
    </EntityContainer>
  );
}
