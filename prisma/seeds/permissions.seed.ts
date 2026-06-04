import { permissions } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function seedPermissions() {
  console.log("Création des permissions...");

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },

      update: {
        libelle: permission.libelle,
        description: permission.description,
      },

      create: {
        code: permission.code,
        libelle: permission.libelle,
        description: permission.description,
      },
    });
  }

  console.log("Permissions créées");
}
