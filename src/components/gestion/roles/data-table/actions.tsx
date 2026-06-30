"use client";

import { supprimerRoleAction } from "@/actions/role.actions";

import {
  EntityContainer,
  EntityDeleteAction,
  EntityEditAction,
  EntityViewAction,
} from "@/components/ui/entity-actions";

import { Routes } from "@/lib/routes";

import { RoleRecherche } from "@/services/role.service";

interface Props {
  role: RoleRecherche;
}

export function RoleActions({ role }: Props) {
  return (
    <EntityContainer>
      <EntityDeleteAction
        titre={`Supprimer le rôle ${role.nom}`}
        description={`Êtes-vous sûr de vouloir supprimer le rôle "${role.nom}" ?`}
        formAction={supprimerRoleAction.bind(null, role.id)}
        disabled={role._count.utilisateurs > 0}
      />

      <EntityViewAction href={Routes.role(role.id)} />

      <EntityEditAction href={Routes.modifierRole(role.id)} />
    </EntityContainer>
  );
}
