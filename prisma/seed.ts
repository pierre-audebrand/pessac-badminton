import { prisma } from "../src/lib/prisma";

import { seedPermissions } from "./seeds/permissions.seed";
import { seedRoles } from "./seeds/roles.seed";
import { seedAdmin } from "./seeds/admin.seed";
import { seedCms } from "./seeds/cms.seed";

async function main() {
  console.log("Début Seed");

  await seedPermissions();

  const adminRole = await seedRoles();

  await seedAdmin(adminRole);

  await seedCms();

  console.log("Seed terminé");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
