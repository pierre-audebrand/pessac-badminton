"use server";

import { Permissions } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Routes } from "@/lib/routes";

import { creerSalleSchema, modifierSalleSchema } from "@/schemas/salle.schemas";

import {
  creerSalle,
  modifierActivationSalle,
  modifierSalle,
  SalleDejaExistanteError,
} from "@/services/salle.service";
import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";
import { exigerPermission } from "@/lib/autorisations";

export type SalleFormState = FormState<
  "nom" | "adresse" | "codePostal" | "ville" | "actif"
>;

export async function creerSalleAction(
  _state: SalleFormState,
  formData: FormData,
): Promise<SalleFormState> {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const resultatValidation = creerSalleSchema.safeParse({
    nom: formData.get("nom"),
    adresse: formData.get("adresse"),
    codePostal: formData.get("codePostal"),
    ville: formData.get("ville"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await creerSalle(resultatValidation.data);
  } catch (error) {
    if (error instanceof SalleDejaExistanteError) {
      return {
        erreurs: construireErreur("nom", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_SALLES);

  redirect(Routes.GESTION_SALLES);
}

export async function modifierSalleAction(
  salleId: string,
  _state: SalleFormState,
  formData: FormData,
): Promise<SalleFormState> {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const resultatValidation = modifierSalleSchema.safeParse({
    nom: formData.get("nom"),
    adresse: formData.get("adresse"),
    codePostal: formData.get("codePostal"),
    ville: formData.get("ville"),
    actif: formData.get("actif") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierSalle(salleId, resultatValidation.data);
  } catch (error) {
    if (error instanceof SalleDejaExistanteError) {
      return {
        erreurs: construireErreur("nom", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_SALLES);

  redirect(Routes.salle(salleId));
}

export async function modifierActivationSalleAction(
  salleId: string,
  actif: boolean,
) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  await modifierActivationSalle(salleId, actif);

  revalidatePath(Routes.GESTION_SALLES);
}
