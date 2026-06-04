import { EntiteIntrouvableError } from "@/lib/errors";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { CreerPageData, ModifierPageData } from "@/schemas/page.schemas";
import { Page, Prisma } from "@prisma/client";

export const pageSortableFields = [
  "titre",
  "chemin",
  "publiee",
  "createdAt",
] as const;

export type PageSortField = (typeof pageSortableFields)[number];

export interface RechercherPagesParams {
  page?: number;
  pageSize?: number;

  q?: string;

  publiee?: boolean;

  sort?: PageSortField;

  order?: "asc" | "desc";
}

export type PageRecherche = Page; //Prisma.PageGetPayload<{}>;

export async function rechercherPages({
  page = 1,
  pageSize = 20,
  q = "",
  publiee,
  sort = "titre",
  order = "asc",
}: RechercherPagesParams = {}): Promise<ResultatPagine<PageRecherche>> {
  const search = q.trim();

  const where: Prisma.PageWhereInput = {
    ...(search && {
      OR: [
        {
          titre: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          chemin: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(publiee !== undefined && {
      publiee,
    }),
  };

  const safeSort = pageSortableFields.includes(sort) ? sort : "titre";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.page.count({
      where,
    }),
  ]);

  return {
    elements: pages,

    total,

    page: safePage,

    pageSize: safePageSize,

    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function listerPages() {
  return prisma.page.findMany({
    orderBy: {
      titre: "asc",
    },
  });
}

export async function recupererPageParId(pageId: string) {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    throw new EntiteIntrouvableError("Page");
  }

  return page;
}

export async function recupererPageParChemin(chemin: string) {
  return prisma.page.findFirst({
    where: {
      chemin,
      publiee: true,
    },
  });
}

export class PageDejaExistanteError extends Error {
  constructor() {
    super("Une page utilise déjà ce chemin");
  }
}

export async function creerPage(data: CreerPageData) {
  const pageExistante = await prisma.page.findUnique({
    where: {
      chemin: data.chemin,
    },
  });

  if (pageExistante) {
    throw new PageDejaExistanteError();
  }

  return prisma.page.create({
    data: {
      titre: data.titre,
      chemin: data.chemin,

      seoTitre: data.seoTitre,
      seoDescription: data.seoDescription,

      publiee: data.publiee,
    },
  });
}

export async function modifierPage(pageId: string, data: ModifierPageData) {
  await recupererPageParId(pageId);

  const pageExistante = await prisma.page.findFirst({
    where: {
      chemin: data.chemin,

      NOT: {
        id: pageId,
      },
    },
  });

  if (pageExistante) {
    throw new PageDejaExistanteError();
  }

  return prisma.page.update({
    where: {
      id: pageId,
    },

    data: {
      titre: data.titre,
      chemin: data.chemin,

      seoTitre: data.seoTitre,
      seoDescription: data.seoDescription,

      publiee: data.publiee,
    },
  });
}

export class PageUtiliseeDansMenuError extends Error {
  constructor() {
    super("Impossible de supprimer une page utilisée dans un menu");
  }
}

export async function supprimerPage(pageId: string) {
  await recupererPageParId(pageId);

  const nbMenuItems = await prisma.menuItem.count({
    where: {
      pageId,
    },
  });

  if (nbMenuItems > 0) {
    throw new PageUtiliseeDansMenuError();
  }

  return prisma.page.delete({
    where: {
      id: pageId,
    },
  });
}

export async function modifierPublicationPage(
  pageId: string,
  publiee: boolean,
) {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    throw new EntiteIntrouvableError("Page");
  }

  return prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      publiee,
    },
  });
}
