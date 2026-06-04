import { prisma } from "@/lib/prisma";
import { Roles } from "@/lib/roles";

export async function seedRoles() {
  console.log("Création des rôles...");

  const adminRole = await prisma.role.upsert({
    where: {
      nom: Roles.ADMIN,
    },
    update: {},
    create: {
      nom: Roles.ADMIN,
      description: "Gestion complète",
      systeme: true,
    },
  });

  await prisma.role.upsert({
    where: {
      nom: Roles.ADHERENT,
    },
    update: {},
    create: {
      nom: Roles.ADHERENT,
      description: "Membre du club",
      systeme: true,
    },
  });

  console.log("Rôles créés");

  return adminRole;
}
