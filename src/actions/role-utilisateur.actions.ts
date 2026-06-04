"use server";

import { revalidatePath } from "next/cache";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";
import { modifierRolesUtilisateurSchema } from "@/schemas/role-utilisateur.schemas";
import { modifierRolesUtilisateur } from "@/services/role-utilisateur.service";
import {
  ajouterErreursZod,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";

export type UtilisateurRolesFormState = FormState<"roles">;

export async function modifierRolesUtilisateurAction(
  utilisateurId: string,
  _state: UtilisateurRolesFormState,
  formData: FormData,
): Promise<UtilisateurRolesFormState> {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const resultatValidation = modifierRolesUtilisateurSchema.safeParse({
    roles: formData.getAll("roles"),
  });

  if (!resultatValidation.success) {
    return { erreurs: ajouterErreursZod({}, resultatValidation.error.issues) };
  }

  try {
    await modifierRolesUtilisateur(
      utilisateurId,
      resultatValidation.data.roles,
    );
  } catch (error) {
    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_UTILISATEURS);
  revalidatePath(Routes.utilisateur(utilisateurId));
  revalidatePath(Routes.rolesUtilisateur(utilisateurId));

  return {
    succes: true,
    message: "Rôles enregistrés avec succès.",
  };
}
