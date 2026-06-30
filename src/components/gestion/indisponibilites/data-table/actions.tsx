"use client";

import { supprimerIndisponibiliteAction } from "@/actions/indisponibilite.actions";

import {
  EntityContainer,
  EntityDeleteAction,
  EntityEditAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { Routes } from "@/lib/routes";

import { IndisponibiliteRecherche } from "@/services/indisponibilite.service";

type Props = {
  indisponibilite: IndisponibiliteRecherche;
};

export function IndisponibiliteActions({ indisponibilite }: Props) {
  return (
    <EntityContainer>
      <EntityDeleteAction
        titre="Supprimer l'indisponibilité"
        description="Êtes-vous sûr de vouloir supprimer cette indisponibilité ?"
        formAction={supprimerIndisponibiliteAction.bind(
          null,
          indisponibilite.id,
        )}
      />

      <EntityViewAction href={Routes.indisponibilite(indisponibilite.id)} />

      <EntityEditAction
        href={Routes.modifierIndisponibilite(indisponibilite.id)}
      />
    </EntityContainer>
  );
}
