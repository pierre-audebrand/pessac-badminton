import { prisma } from "../src/lib/prisma";

async function main() {
  const nbRoles = await prisma.role.count();

  console.log(`Nombre de rôles : ${nbRoles}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
