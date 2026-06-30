"use client";

import {
  modifierPublicationPageAction,
  supprimerPageAction,
} from "@/actions/page.actions";

import {
  EntityContainer,
  EntityDeleteAction,
  EntityEditAction,
  EntityToggleAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { Routes } from "@/lib/routes";

import { PageRecherche } from "@/services/page.service";
import { Globe, GlobeLock } from "lucide-react";

interface Props {
  page: PageRecherche;
}

export function PageActions({ page }: Props) {
  return (
    <EntityContainer>
      <EntityDeleteAction
        titre={`Supprimer la page ${page.titre}`}
        description={`Êtes-vous sûr de vouloir supprimer la page "${page.titre}" ?`}
        formAction={supprimerPageAction.bind(null, page.id)}
      />

      <EntityToggleAction
        active={page.publiee}
        activateAction={modifierPublicationPageAction.bind(null, page.id, true)}
        deactivateAction={modifierPublicationPageAction.bind(
          null,
          page.id,
          false,
        )}
        activateLabel="Publier"
        deactivateLabel="Dépublier"
        activateIcon={Globe}
        deactivateIcon={GlobeLock}
      />

      <EntityViewAction href={Routes.page(page.id)} />

      <EntityEditAction href={Routes.modifierPage(page.id)} />
    </EntityContainer>
  );
}
