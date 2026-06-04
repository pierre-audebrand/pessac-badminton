import { prisma } from "@/lib/prisma";

export async function seedCms() {
  console.log("Création des menus...");

  const menuPrincipal = await prisma.menu.upsert({
    where: {
      code: "principal",
    },
    update: {},
    create: {
      code: "principal",
      nom: "Menu principal",
    },
  });

  const menuFooter = await prisma.menu.upsert({
    where: {
      code: "footer",
    },
    update: {},
    create: {
      code: "footer",
      nom: "Pied de page",
    },
  });

  console.log("Menus créés");

  console.log("Création des pages...");

  const accueil = await creerPage("Accueil", "");

  const presentation = await creerPage("Présentation", "club/presentation");

  const bureau = await creerPage("Le bureau", "club/bureau");

  const salles = await creerPage("Les salles", "club/salles");

  const partenaires = await creerPage("Nos partenaires", "club/partenaires");

  const creneaux = await creerPage("Créneaux", "creneaux");

  const tarifs = await creerPage("Tarifs", "inscription/tarifs");

  const documents = await creerPage(
    "Documents d'inscription",
    "inscription/documents",
  );

  const reglement = await creerPage(
    "Règlement intérieur",
    "inscription/reglement",
  );

  const actualites = await creerPage("Actualités", "actualites");

  const contact = await creerPage("Contact", "contact");

  const mentions = await creerPage("Mentions légales", "mentions-legales");

  const confidentialite = await creerPage(
    "Politique de confidentialité",
    "politique-confidentialite",
  );

  console.log("Pages créées");

  console.log("Création des éléments de menus...");

  await prisma.menuItem.deleteMany({
    where: {
      menuId: {
        in: [menuPrincipal.id, menuFooter.id],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: menuPrincipal.id,
      label: "Accueil",
      type: "PAGE",
      pageId: accueil.id,
      ordre: 1,
    },
  });

  const club = await prisma.menuItem.create({
    data: {
      menuId: menuPrincipal.id,
      label: "Le Club",
      type: "GROUPE",
      ordre: 2,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        menuId: menuPrincipal.id,
        parentId: club.id,
        label: "Présentation",
        type: "PAGE",
        pageId: presentation.id,
        ordre: 1,
      },
      {
        menuId: menuPrincipal.id,
        parentId: club.id,
        label: "Le bureau",
        type: "PAGE",
        pageId: bureau.id,
        ordre: 2,
      },
      {
        menuId: menuPrincipal.id,
        parentId: club.id,
        label: "Les salles",
        type: "PAGE",
        pageId: salles.id,
        ordre: 3,
      },
      {
        menuId: menuPrincipal.id,
        parentId: club.id,
        label: "Nos partenaires",
        type: "PAGE",
        pageId: partenaires.id,
        ordre: 4,
      },
    ],
  });

  await prisma.menuItem.create({
    data: {
      menuId: menuPrincipal.id,
      label: "Créneaux",
      type: "PAGE",
      pageId: creneaux.id,
      ordre: 3,
    },
  });

  const adhesion = await prisma.menuItem.create({
    data: {
      menuId: menuPrincipal.id,
      label: "Adhésion",
      type: "GROUPE",
      ordre: 4,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        menuId: menuPrincipal.id,
        parentId: adhesion.id,
        label: "Tarifs",
        type: "PAGE",
        pageId: tarifs.id,
        ordre: 1,
      },
      {
        menuId: menuPrincipal.id,
        parentId: adhesion.id,
        label: "Documents d'inscription",
        type: "PAGE",
        pageId: documents.id,
        ordre: 2,
      },
      {
        menuId: menuPrincipal.id,
        parentId: adhesion.id,
        label: "Règlement intérieur",
        type: "PAGE",
        pageId: reglement.id,
        ordre: 3,
      },
    ],
  });

  await prisma.menuItem.create({
    data: {
      menuId: menuPrincipal.id,
      label: "Actualités",
      type: "PAGE",
      pageId: actualites.id,
      ordre: 5,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuId: menuPrincipal.id,
      label: "Contact",
      type: "PAGE",
      pageId: contact.id,
      ordre: 6,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        menuId: menuFooter.id,
        label: "Mentions légales",
        type: "PAGE",
        pageId: mentions.id,
        ordre: 1,
      },
      {
        menuId: menuFooter.id,
        label: "Politique de confidentialité",
        type: "PAGE",
        pageId: confidentialite.id,
        ordre: 2,
      },
      {
        menuId: menuFooter.id,
        label: "Contact",
        type: "PAGE",
        pageId: contact.id,
        ordre: 3,
      },
    ],
  });

  console.log("Éléments de menus créés");
}

async function creerPage(titre: string, chemin: string) {
  return prisma.page.upsert({
    where: {
      chemin,
    },
    update: {
      titre,
    },
    create: {
      titre,
      chemin,
      publiee: true,
    },
  });
}
