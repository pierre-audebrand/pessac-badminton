"use client";

import { CalendarX2 } from "lucide-react";

import { modifierActivationSalleAction } from "@/actions/salle.actions";

import {
  EntityContainer,
  EntityCustomAction,
  EntityEditAction,
  EntityToggleAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { Routes } from "@/lib/routes";

import { SalleRecherche } from "@/services/salle.service";

interface Props {
  salle: SalleRecherche;
}

export function SalleActions({ salle }: Props) {
  return (
    <EntityContainer>
      <EntityToggleAction
        active={salle.actif}
        activateAction={modifierActivationSalleAction.bind(
          null,
          salle.id,
          true,
        )}
        deactivateAction={modifierActivationSalleAction.bind(
          null,
          salle.id,
          false,
        )}
      />

      <EntityCustomAction
        href={`${Routes.GESTION_INDISPONIBILITES_NOUVELLE}?salleId=${salle.id}`}
        icon={CalendarX2}
        label="Ajouter une indisponibilité"
      />

      <EntityViewAction href={Routes.salle(salle.id)} />

      <EntityEditAction href={Routes.modifierSalle(salle.id)} />
    </EntityContainer>
  );
}
