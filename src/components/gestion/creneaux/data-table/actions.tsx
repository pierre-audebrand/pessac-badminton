"use client";

import { Users } from "lucide-react";

import { EntityContainer } from "@/components/ui/entity-actions/container";
import { EntityCustomAction } from "@/components/ui/entity-actions/custom-action";
import { EntityEditAction } from "@/components/ui/entity-actions/edit-action";
import { EntityToggleAction } from "@/components/ui/entity-actions/toggle-action";
import { EntityViewAction } from "@/components/ui/entity-actions/view-action";

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
