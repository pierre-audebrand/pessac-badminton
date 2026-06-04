"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  creerCreneauSchema,
  modifierCreneauSchema,
} from "@/schemas/creneau.schemas";

import {
  creerCreneau,
  modifierCreneau,
  CreneauEnConflitError,
  modifierActivationCreneau,
} from "@/services/creneau.service";

export type CreneauFormState = FormState<
  "salleId" | "jourSemaine" | "type" | "heureDebut" | "heureFin" | "actif"
>;

export async function creerCreneauAction(
  _state: CreneauFormState,
  formData: FormData,
): Promise<CreneauFormState> {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const resultatValidation = creerCreneauSchema.safeParse({
    salleId: formData.get("salleId"),
    jourSemaine: formData.get("jourSemaine"),
    heureDebut: formData.get("heureDebut"),
    heureFin: formData.get("heureFin"),
    type: formData.get("type"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await creerCreneau(resultatValidation.data);
  } catch (error) {
    if (error instanceof CreneauEnConflitError) {
      return {
        erreurs: construireErreur("heureDebut", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_CRENEAUX);

  redirect(Routes.GESTION_CRENEAUX);
}

export async function modifierCreneauAction(
  creneauId: string,
  _state: CreneauFormState,
  formData: FormData,
): Promise<CreneauFormState> {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  console.log("type =", formData.get("type"));

  const resultatValidation = modifierCreneauSchema.safeParse({
    salleId: formData.get("salleId"),
    jourSemaine: formData.get("jourSemaine"),
    heureDebut: formData.get("heureDebut"),
    heureFin: formData.get("heureFin"),
    type: formData.get("type"),
    actif: formData.get("actif") === "on",
  });

  console.log(resultatValidation.data);

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierCreneau(creneauId, resultatValidation.data);
  } catch (error) {
    if (error instanceof CreneauEnConflitError) {
      return {
        erreurs: construireErreur("heureDebut", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_CRENEAUX);

  redirect(Routes.creneau(creneauId));
}

export async function modifierActivationCreneauAction(
  creneauId: string,
  actif: boolean,
) {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  await modifierActivationCreneau(creneauId, actif);

  revalidatePath(Routes.GESTION_CRENEAUX);
}
