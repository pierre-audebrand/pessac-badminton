import { Menu, Prisma } from "@prisma/client";

import { EntiteIntrouvableError } from "@/lib/errors";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import {
  CreerMenuItemData,
  ModifierMenuItemData,
} from "@/schemas/menu-item.schemas";

export const menuItemSortableFields = [
  "libelle",
  "menu",
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

  actif?: boolean;

  sort?: MenuItemSortField;

  order?: "asc" | "desc";
}

/* -------------------------------------------------------------------------- */
/*                                    Include                                 */
/* -------------------------------------------------------------------------- */

const menuItemListInclude = {
  page: true,
  parent: true,
} satisfies Prisma.MenuItemInclude;

const menuItemDetailInclude = {
  page: true,

  parent: {
    include: {
      page: true,
    },
  },

  enfants: {
    include: {
      page: true,
    },

    orderBy: {
      ordre: "asc",
    },
  },
} satisfies Prisma.MenuItemInclude;

const menuItemTreeInclude = {
  page: true,
  parent: true,
} satisfies Prisma.MenuItemInclude;

/* -------------------------------------------------------------------------- */
/*                                     Types                                  */
/* -------------------------------------------------------------------------- */

export type MenuItemRecherche = Prisma.MenuItemGetPayload<{
  include: typeof menuItemListInclude;
}>;

export type MenuItemDetail = Prisma.MenuItemGetPayload<{
  include: typeof menuItemDetailInclude;
}>;

export type MenuItemArbre = Prisma.MenuItemGetPayload<{
  include: typeof menuItemTreeInclude;
}>;

export type MenuItemHierarchique = MenuItemArbre & {
  enfants: MenuItemHierarchique[];
};

/* -------------------------------------------------------------------------- */
/*                               Helpers privés                               */
/* -------------------------------------------------------------------------- */

function trierArbre(items: MenuItemHierarchique[]) {
  items.sort((a, b) => a.ordre - b.ordre);

  items.forEach((item) => trierArbre(item.enfants));
}

function construireArbreMenu(items: MenuItemArbre[]): MenuItemHierarchique[] {
  const map = new Map<string, MenuItemHierarchique>();

  for (const item of items) {
    map.set(item.id, {
      ...item,
      enfants: [],
    });
  }

  const racines: MenuItemHierarchique[] = [];

  for (const item of map.values()) {
    if (item.parentId) {
      map.get(item.parentId)?.enfants.push(item);
    } else {
      racines.push(item);
    }
  }

  trierArbre(racines);

  return racines;
}

/* -------------------------------------------------------------------------- */
/*                                   Lecture                                  */
/* -------------------------------------------------------------------------- */

export async function rechercherMenuItems({
  page = 1,
  pageSize = 20,
  q = "",
  menu,
  actif,
  sort = "ordre",
  order = "asc",
}: RechercherMenuItemsParams = {}): Promise<ResultatPagine<MenuItemRecherche>> {
  const search = q.trim();

  const where: Prisma.MenuItemWhereInput = {
    ...(search && {
      OR: [
        {
          libelle: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          page: {
            titre: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    }),

    ...(menu && { menu }),

    ...(actif !== undefined && { actif }),
  };

  const safeSort = menuItemSortableFields.includes(sort) ? sort : "ordre";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [elements, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,

      include: menuItemListInclude,

      orderBy:
        safeSort === "ordre"
          ? [{ menu: "asc" }, { parentId: "asc" }, { ordre: "asc" }]
          : [
              {
                [safeSort]: order,
              },
              {
                libelle: "asc",
              },
            ],

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.menuItem.count({
      where,
    }),
  ]);

  return {
    elements,

    total,

    page: safePage,

    pageSize: safePageSize,

    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function recupererArbreMenu(
  menu: Menu,
): Promise<MenuItemHierarchique[]> {
  const items = await prisma.menuItem.findMany({
    where: {
      menu,
    },

    include: menuItemTreeInclude,

    orderBy: {
      ordre: "asc",
    },
  });

  return construireArbreMenu(items);
}

export async function recupererMenuItemParId(
  menuItemId: string,
): Promise<MenuItemDetail> {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: menuItemId,
    },

    include: menuItemDetailInclude,
  });

  if (!menuItem) {
    throw new EntiteIntrouvableError("Élément de menu");
  }

  return menuItem;
}

export async function listerMenuItems(): Promise<MenuItemRecherche[]> {
  return prisma.menuItem.findMany({
    include: menuItemListInclude,

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

export async function listerParentsMenuItems(menu: Menu, menuItemId?: string) {
  return prisma.menuItem.findMany({
    where: {
      menu,
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

/* -------------------------------------------------------------------------- */
/*                               Erreurs métier                               */
/* -------------------------------------------------------------------------- */

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

export class MenuItemPossedeDesEnfantsError extends Error {
  constructor() {
    super("Impossible de supprimer un élément contenant des sous-éléments.");
  }
}

/* -------------------------------------------------------------------------- */
/*                                Validation                                  */
/* -------------------------------------------------------------------------- */

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

    if (parent.parentId) {
      throw new ParentNonAutoriseError();
    }
  }

  if (data.pageId) {
    const page = await prisma.page.findUnique({
      where: {
        id: data.pageId,
      },
    });

    if (!page) {
      throw new EntiteIntrouvableError("Page");
    }

    const pageExistante = await prisma.menuItem.findFirst({
      where: {
        menu: data.menu,
        pageId: data.pageId,

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

/* -------------------------------------------------------------------------- */
/*                                   CRUD                                     */
/* -------------------------------------------------------------------------- */

function construireDonneesMenuItem(
  data: CreerMenuItemData | ModifierMenuItemData,
): Prisma.MenuItemUncheckedCreateInput {
  return {
    menu: data.menu,

    parentId: data.parentId,

    libelle: data.libelle,

    pageId: data.pageId || null,
    url: data.url || null,

    ordre: data.ordre,

    nouvelOnglet: data.nouvelOnglet,

    actif: data.actif,
  };
}

export async function creerMenuItem(data: CreerMenuItemData) {
  await verifierMenuItem(data);

  return prisma.menuItem.create({
    data: construireDonneesMenuItem(data),

    include: menuItemListInclude,
  });
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

    data: construireDonneesMenuItem(data),

    include: menuItemListInclude,
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
