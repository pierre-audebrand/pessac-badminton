import { EntiteIntrouvableError } from "@/lib/errors";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import {
  CreerMenuItemData,
  ModifierMenuItemData,
} from "@/schemas/menu-item.schemas";
import { Menu, Prisma, TypeMenuItem } from "@prisma/client";

export const menuItemSortableFields = [
  "libelle",
  "menu",
  "type",
  "ordre",
  "actif",
  "createdAt",
] as const;

export type MenuItemSortField = (typeof menuItemSortableFields)[number];

export interface RechercherMenuItemsParams {
  page?: number;
  pageSize?: number;

  q?: string;

  menu?: Menu;

  type?: TypeMenuItem;

  actif?: boolean;

  sort?: MenuItemSortField;

  order?: "asc" | "desc";
}

const menuItemInclude = {
  page: true,
  parent: true,
  enfants: {
    orderBy: {
      ordre: "asc",
    },
  },
} satisfies Prisma.MenuItemInclude;

export type MenuItemRecherche = Prisma.MenuItemGetPayload<{
  include: typeof menuItemInclude;
}>;

export async function rechercherMenuItems({
  page = 1,
  pageSize = 20,
  q = "",
  menu,
  type,
  actif,
  sort = "ordre",
  order = "asc",
}: RechercherMenuItemsParams = {}): Promise<ResultatPagine<MenuItemRecherche>> {
  const search = q.trim();

  const where: Prisma.MenuItemWhereInput = {
    ...(search && {
      libelle: {
        contains: search,
        mode: "insensitive",
      },
    }),

    ...(menu && {
      menu,
    }),

    ...(type && {
      type,
    }),

    ...(actif !== undefined && {
      actif,
    }),
  };

  const safeSort = menuItemSortableFields.includes(sort) ? sort : "ordre";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [menuItems, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,

      include: menuItemInclude,

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.menuItem.count({
      where,
    }),
  ]);

  return {
    elements: menuItems,

    total,

    page: safePage,

    pageSize: safePageSize,

    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function listerMenuItems() {
  return prisma.menuItem.findMany({
    include: menuItemInclude,

    orderBy: [
      {
        menu: "asc",
      },
      {
        ordre: "asc",
      },
    ],
  });
}

export async function listerParentsMenuItems(menuItemId?: string) {
  return prisma.menuItem.findMany({
    where: {
      parentId: null,

      ...(menuItemId && {
        NOT: {
          id: menuItemId,
        },
      }),
    },

    include: {
      page: true,
    },

    orderBy: [
      {
        menu: "asc",
      },
      {
        ordre: "asc",
      },
      {
        libelle: "asc",
      },
    ],
  });
}

export async function recupererMenuItemParId(menuItemId: string) {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: menuItemId,
    },

    include: menuItemInclude,
  });

  if (!menuItem) {
    throw new EntiteIntrouvableError("Élément de menu");
  }

  return menuItem;
}

export class ParentInvalideError extends Error {
  constructor() {
    super("Le parent sélectionné est invalide.");
  }
}

export class ParentNonAutoriseError extends Error {
  constructor() {
    super("Impossible d'ajouter un troisième niveau dans le menu.");
  }
}

export class ParentDansUnAutreMenuError extends Error {
  constructor() {
    super("Le parent appartient à un autre menu.");
  }
}

export class PageDejaUtiliseeDansMenuError extends Error {
  constructor() {
    super("Cette page est déjà utilisée dans ce menu.");
  }
}

async function verifierMenuItem(
  data: CreerMenuItemData | ModifierMenuItemData,
  menuItemId?: string,
) {
  if (data.parentId) {
    if (menuItemId && data.parentId === menuItemId) {
      throw new ParentInvalideError();
    }

    const parent = await prisma.menuItem.findUnique({
      where: {
        id: data.parentId,
      },
    });

    if (!parent) {
      throw new ParentInvalideError();
    }

    if (parent.menu !== data.menu) {
      throw new ParentDansUnAutreMenuError();
    }

    // Maximum 2 niveaux
    if (parent.parentId) {
      throw new ParentNonAutoriseError();
    }
  }

  if (data.type === TypeMenuItem.PAGE) {
    const page = await prisma.page.findUnique({
      where: {
        id: data.pageId!,
      },
    });

    if (!page) {
      throw new EntiteIntrouvableError("Page");
    }

    const pageExistante = await prisma.menuItem.findFirst({
      where: {
        menu: data.menu,
        pageId: data.pageId!,

        ...(menuItemId && {
          NOT: {
            id: menuItemId,
          },
        }),
      },
    });

    if (pageExistante) {
      throw new PageDejaUtiliseeDansMenuError();
    }
  }
}

export async function creerMenuItem(data: CreerMenuItemData) {
  await verifierMenuItem(data);

  return prisma.menuItem.create({
    data: {
      menu: data.menu,

      parentId: data.parentId,

      libelle: data.libelle,

      type: data.type,

      pageId: data.pageId,

      url: data.url,

      ordre: data.ordre,

      nouvelOnglet: data.nouvelOnglet,

      actif: data.actif,
    },

    include: menuItemInclude,
  });
}

export class MenuItemPossedeDesEnfantsError extends Error {
  constructor() {
    super("Impossible de supprimer un élément contenant des sous-éléments.");
  }
}

export async function modifierMenuItem(
  menuItemId: string,
  data: ModifierMenuItemData,
) {
  await recupererMenuItemParId(menuItemId);

  await verifierMenuItem(data, menuItemId);

  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },

    data: {
      menu: data.menu,

      parentId: data.parentId,

      libelle: data.libelle,

      type: data.type,

      pageId: data.pageId,

      url: data.url,

      ordre: data.ordre,

      nouvelOnglet: data.nouvelOnglet,

      actif: data.actif,
    },

    include: menuItemInclude,
  });
}

export async function supprimerMenuItem(menuItemId: string) {
  await recupererMenuItemParId(menuItemId);

  const nbEnfants = await prisma.menuItem.count({
    where: {
      parentId: menuItemId,
    },
  });

  if (nbEnfants > 0) {
    throw new MenuItemPossedeDesEnfantsError();
  }

  return prisma.menuItem.delete({
    where: {
      id: menuItemId,
    },
  });
}

export async function modifierActivationMenuItem(
  menuItemId: string,
  actif: boolean,
) {
  await recupererMenuItemParId(menuItemId);

  return prisma.menuItem.update({
    where: {
      id: menuItemId,
    },

    data: {
      actif,
    },
  });
}
