import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Routes } from "./routes";

export async function obtenirSession() {
  return getServerSession(authOptions);
}

export async function exigerConnexion() {
  const session = await obtenirSession();

  if (!session) {
    redirect(Routes.CONNEXION);
  }

  return session;
}

export async function obtenirUtilisateurConnecte() {
  const session = await exigerConnexion();

  return {
    id: session.user.id,
    email: session.user.email,
    prenomEtNom: session.user.name,
    roles: session.user.roles,
    permissions: session.user.permissions,
  };
}
