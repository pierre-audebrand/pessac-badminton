"use server";

import { Permissions } from "@/lib/permissions";
import { exigerPermission } from "@/lib/autorisations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Routes } from "@/lib/routes";
import {
  creerUtilisateur,
  modifierActivationUtilisateur,
  modifierUtilisateur,
  UtilisateurDejaExistantError,
} from "@/services/utilisateur.service";
import {
  creerUtilisateurSchema,
  modifierUtilisateurSchema,
} from "@/schemas/utilisateur.schemas";
import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";
import { obtenirUtilisateurConnecte } from "@/lib/authentification";

export type UtilisateurFormState = FormState<
  "prenom" | "nom" | "email" | "dateNaissance" | "motDePasse" | "actif"
>;

export async function creerUtilisateurAction(
  _state: UtilisateurFormState,
  formData: FormData,
): Promise<UtilisateurFormState> {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const resultatValidation = creerUtilisateurSchema.safeParse({
    prenom: formData.get("prenom"),
    nom: formData.get("nom"),
    dateNaissance: formData.get("dateNaissance"),
    email: formData.get("email"),
    motDePasse: formData.get("motDePasse"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }
  try {
    await creerUtilisateur(resultatValidation.data);
  } catch (error) {
    if (error instanceof UtilisateurDejaExistantError)
      return { erreurs: construireErreur("email", error.message) };

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_UTILISATEURS);

  redirect(Routes.GESTION_UTILISATEURS);
}

export async function modifierUtilisateurAction(
  utilisateurId: string,
  _state: UtilisateurFormState,
  formData: FormData,
): Promise<UtilisateurFormState> {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const resultatValidation = modifierUtilisateurSchema.safeParse({
    prenom: formData.get("prenom"),
    nom: formData.get("nom"),
    dateNaissance: formData.get("dateNaissance"),
    email: formData.get("email"),
    actif: formData.get("actif") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierUtilisateur(utilisateurId, resultatValidation.data);
  } catch (error) {
    if (error instanceof UtilisateurDejaExistantError)
      return { erreurs: construireErreur("email", error.message) };

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_UTILISATEURS);

  redirect(Routes.utilisateur(utilisateurId));
}

export async function modifierActivationUtilisateurAction(
  utilisateurId: string,
  actif: boolean,
) {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const utilisateurConnecte = await obtenirUtilisateurConnecte();

  if (utilisateurConnecte.id === utilisateurId && !actif) {
    throw new Error("Vous ne pouvez pas désactiver votre propre compte.");
  }

  await modifierActivationUtilisateur(utilisateurId, actif);

  revalidatePath(Routes.GESTION_UTILISATEURS);
}
