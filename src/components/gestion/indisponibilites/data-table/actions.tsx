"use client";

import { supprimerIndisponibiliteAction } from "@/actions/indisponibilite.actions";

import { EntityContainer } from "@/components/ui/entity-actions/container";
import { EntityDeleteAction } from "@/components/ui/entity-actions/delete-action";
import { EntityEditAction } from "@/components/ui/entity-actions/edit-action";
import { EntityViewAction } from "@/components/ui/entity-actions/view-action";

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
