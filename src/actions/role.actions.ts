"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  creerRole,
  modifierRole,
  RoleDejaExistantError,
  supprimerRole,
} from "@/services/role.service";

import { creerRoleSchema, modifierRoleSchema } from "@/schemas/role.schemas";
import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";

export type RoleFormState = FormState<"nom" | "description" | "permissions">;

export async function creerRoleAction(
  _state: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  await exigerPermission(Permissions.ROLES_GERER.code);

  const resultatValidation = creerRoleSchema.safeParse({
    nom: formData.get("nom"),
    description: formData.get("description"),
    permissions: formData.getAll("permissions"),
  });

  if (!resultatValidation.success) {
    return { erreurs: ajouterErreursZod({}, resultatValidation.error.issues) };
  }

  try {
    await creerRole(resultatValidation.data);
  } catch (error) {
    if (error instanceof RoleDejaExistantError) {
      return { erreurs: construireErreur("nom", error.message) };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_ROLES);

  redirect(Routes.GESTION_ROLES);
}

export async function modifierRoleAction(
  roleId: string,
  _state: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  await exigerPermission(Permissions.ROLES_GERER.code);

  const resultatValidation = modifierRoleSchema.safeParse({
    nom: formData.get("nom"),
    description: formData.get("description"),
    permissions: formData.getAll("permissions"),
  });

  if (!resultatValidation.success) {
    return { erreurs: ajouterErreursZod({}, resultatValidation.error.issues) };
  }

  try {
    await modifierRole(roleId, resultatValidation.data);
  } catch (error) {
    if (error instanceof RoleDejaExistantError) {
      return { erreurs: construireErreur("nom", error.message) };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_ROLES);

  redirect(Routes.role(roleId));
}

export async function supprimerRoleAction(roleId: string) {
  await exigerPermission(Permissions.ROLES_GERER.code);

  await supprimerRole(roleId);

  revalidatePath(Routes.GESTION_ROLES);
}
