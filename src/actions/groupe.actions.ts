"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { exigerPermission } from "@/lib/autorisations";

import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";

import {
  creerGroupeSchema,
  modifierGroupeSchema,
} from "@/schemas/groupe.schemas";

import {
  creerGroupe,
  modifierGroupe,
  GroupeDejaExistantError,
  modifierActivationGroupe,
} from "@/services/groupe.service";

export type GroupeFormState = FormState<
  "nom" | "description" | "ageMin" | "ageMax" | "actif"
>;

export async function creerGroupeAction(
  _state: GroupeFormState,
  formData: FormData,
): Promise<GroupeFormState> {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  const resultatValidation = creerGroupeSchema.safeParse({
    nom: formData.get("nom"),
    description: formData.get("description"),
    ageMin: formData.get("ageMin"),
    ageMax: formData.get("ageMax"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await creerGroupe(resultatValidation.data);
  } catch (error) {
    if (error instanceof GroupeDejaExistantError) {
      return {
        erreurs: construireErreur("nom", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_GROUPES);

  redirect(Routes.GESTION_GROUPES);
}

export async function modifierGroupeAction(
  groupeId: string,
  _state: GroupeFormState,
  formData: FormData,
): Promise<GroupeFormState> {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  const resultatValidation = modifierGroupeSchema.safeParse({
    nom: formData.get("nom"),
    description: formData.get("description"),
    ageMin: formData.get("ageMin"),
    ageMax: formData.get("ageMax"),
    actif: formData.get("actif") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierGroupe(groupeId, resultatValidation.data);
  } catch (error) {
    if (error instanceof GroupeDejaExistantError) {
      return {
        erreurs: construireErreur("nom", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_GROUPES);

  redirect(Routes.groupe(groupeId));
}

export async function modifierActivationGroupeAction(
  groupeId: string,
  actif: boolean,
) {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  await modifierActivationGroupe(groupeId, actif);

  revalidatePath(Routes.GESTION_CRENEAUX);
}
