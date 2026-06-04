import { obtenirUtilisateurConnecte } from "@/lib/authentification";

export async function aRole(role: string) {
  const utilisateurConnecte = await obtenirUtilisateurConnecte();

  return utilisateurConnecte.roles.includes(role);
}

export async function aPermission(permission: string) {
  const utilisateurConnecte = await obtenirUtilisateurConnecte();

  return utilisateurConnecte.permissions.includes(permission);
}

export async function exigerRole(role: string) {
  const utilisateurConnecte = await obtenirUtilisateurConnecte();

  if (!utilisateurConnecte.roles.includes(role)) {
    throw new Error("Accès refusé");
  }

  return utilisateurConnecte;
}

export async function exigerPermission(permission: string) {
  const utilisateurConnecte = await obtenirUtilisateurConnecte();

  if (!utilisateurConnecte.permissions.includes(permission)) {
    throw new Error("Accès refusé");
  }

  return utilisateurConnecte;
}
