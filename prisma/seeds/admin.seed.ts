import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedAdmin(adminRole: Role) {
  console.log("Attribution des permissions ADMIN...");

  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log("Permissions ADMIN attribuées");

  console.log("Création de l'utilisateur administrateur...");

  const motDePasseAdmin =
    process.env.ADMIN_PASSWORD ?? "ChangeMoiRapidement123!";

  const motDePasseHash = await bcrypt.hash(motDePasseAdmin, 12);

  const admin = await prisma.utilisateur.upsert({
    where: {
      email: "admin@pessac-badminton.com",
    },
    update: {},
    create: {
      email: "admin@pessac-badminton.com",
      motDePasseHash,
      prenom: "Admin",
      nom: "Pessac",
      actif: true,
    },
  });

  await prisma.utilisateurRole.upsert({
    where: {
      utilisateurId_roleId: {
        utilisateurId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      utilisateurId: admin.id,
      roleId: adminRole.id,
    },
  });

  console.log("Utilisateur administrateur créé");
}
