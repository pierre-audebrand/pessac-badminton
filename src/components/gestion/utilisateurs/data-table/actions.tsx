"use client";

import { modifierActivationUtilisateurAction } from "@/actions/utilisateur.actions";

import { EntityContainer } from "@/components/ui/entity-actions/container";
import { EntityCustomAction } from "@/components/ui/entity-actions/custom-action";
import { EntityEditAction } from "@/components/ui/entity-actions/edit-action";
import { EntityToggleAction } from "@/components/ui/entity-actions/toggle-action";
import { EntityViewAction } from "@/components/ui/entity-actions/view-action";

import { Routes } from "@/lib/routes";

import type { UtilisateurRecherche } from "@/services/utilisateur.service";

import { Shield, Users } from "lucide-react";

interface Props {
  utilisateur: UtilisateurRecherche;
  utilisateurConnecteId: string;
}

export function UtilisateurActions({
  utilisateur,
  utilisateurConnecteId,
}: Props) {
  return (
    <EntityContainer>
      {utilisateur.id !== utilisateurConnecteId && (
        <EntityToggleAction
          active={utilisateur.actif}
          activateAction={modifierActivationUtilisateurAction.bind(
            null,
            utilisateur.id,
            true,
          )}
          deactivateAction={modifierActivationUtilisateurAction.bind(
            null,
            utilisateur.id,
            false,
          )}
        />
      )}

      <EntityCustomAction
        href={Routes.rolesUtilisateur(utilisateur.id)}
        icon={Shield}
        label="Gérer les rôles"
      />

      <EntityCustomAction
        href={Routes.groupesUtilisateur(utilisateur.id)}
        icon={Users}
        label="Gérer les groupes"
      />

      <EntityViewAction href={Routes.utilisateur(utilisateur.id)} />

      <EntityEditAction href={Routes.modifierUtilisateur(utilisateur.id)} />
    </EntityContainer>
  );
}
