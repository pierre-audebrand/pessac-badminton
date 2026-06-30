import { slugify } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { Menu } from "@prisma/client";

export async function seedCms() {
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

  await prisma.menuItem.deleteMany();

  await prisma.menuItem.create({
    data: {
      menu: Menu.PRINCIPAL,
      libelle: "Accueil",
      type: "PAGE",
      pageId: accueil.id,
      ordre: 1,
    },
  });

  const club = await prisma.menuItem.create({
    data: {
      menu: Menu.PRINCIPAL,
      libelle: "Le Club",
      type: "GROUPE",
      ordre: 2,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        menu: Menu.PRINCIPAL,
        parentId: club.id,
        libelle: "Présentation",
        type: "PAGE",
        pageId: presentation.id,
        ordre: 1,
      },
      {
        menu: Menu.PRINCIPAL,
        parentId: club.id,
        libelle: "Le bureau",
        type: "PAGE",
        pageId: bureau.id,
        ordre: 2,
      },
      {
        menu: Menu.PRINCIPAL,
        parentId: club.id,
        libelle: "Les salles",
        type: "PAGE",
        pageId: salles.id,
        ordre: 3,
      },
      {
        menu: Menu.PRINCIPAL,
        parentId: club.id,
        libelle: "Nos partenaires",
        type: "PAGE",
        pageId: partenaires.id,
        ordre: 4,
      },
    ],
  });

  await prisma.menuItem.create({
    data: {
      menu: Menu.PRINCIPAL,
      libelle: "Créneaux",
      type: "PAGE",
      pageId: creneaux.id,
      ordre: 3,
    },
  });

  const adhesion = await prisma.menuItem.create({
    data: {
      menu: Menu.PRINCIPAL,
      libelle: "Adhésion",
      type: "GROUPE",
      ordre: 4,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        menu: Menu.PRINCIPAL,
        parentId: adhesion.id,
        libelle: "Tarifs",
        type: "PAGE",
        pageId: tarifs.id,
        ordre: 1,
      },
      {
        menu: Menu.PRINCIPAL,
        parentId: adhesion.id,
        libelle: "Documents d'inscription",
        type: "PAGE",
        pageId: documents.id,
        ordre: 2,
      },
      {
        menu: Menu.PRINCIPAL,
        parentId: adhesion.id,
        libelle: "Règlement intérieur",
        type: "PAGE",
        pageId: reglement.id,
        ordre: 3,
      },
    ],
  });

  await prisma.menuItem.create({
    data: {
      menu: Menu.PRINCIPAL,
      libelle: "Actualités",
      type: "PAGE",
      pageId: actualites.id,
      ordre: 5,
    },
  });

  await prisma.menuItem.create({
    data: {
      menu: Menu.PRINCIPAL,
      libelle: "Contact",
      type: "PAGE",
      pageId: contact.id,
      ordre: 6,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        menu: Menu.FOOTER,
        libelle: "Mentions légales",
        type: "PAGE",
        pageId: mentions.id,
        ordre: 1,
      },
      {
        menu: Menu.FOOTER,
        libelle: "Politique de confidentialité",
        type: "PAGE",
        pageId: confidentialite.id,
        ordre: 2,
      },
      {
        menu: Menu.FOOTER,
        libelle: "Contact",
        type: "PAGE",
        pageId: contact.id,
        ordre: 3,
      },
    ],
  });

  console.log("Éléments de menus créés");
}

async function creerPage(titre: string, slug: string) {
  return prisma.page.upsert({
    where: {
      slug,
    },
    update: {
      titre,
    },
    create: {
      titre,
      slug: slug === "" ? "" : slugify(slug),
      publiee: true,
    },
  });
}
