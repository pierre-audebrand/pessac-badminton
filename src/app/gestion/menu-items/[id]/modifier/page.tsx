import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { modifierMenuItemAction } from "@/actions/menu-item.actions";

import {
  listerParentsMenuItems,
  recupererMenuItemParId,
} from "@/services/menu-item.service";
import { listerPages } from "@/services/page.service";

import { FormulaireMenuItem } from "@/components/gestion/menu-items/formulaire-menu-item";
import { Menu } from "@prisma/client";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierMenuItemPage({ params }: Props) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const { id } = await params;

  const menuItem = await recupererMenuItemParId(id);

  if (!menuItem) {
    notFound();
  }

  const [pages, parentsEnTete, parentsPiedDePage] = await Promise.all([
    listerPages(),
    listerParentsMenuItems(Menu.EN_TETE, menuItem.id),
    listerParentsMenuItems(Menu.PIED_DE_PAGE, menuItem.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{"Modifier l'élément de menu"}</h1>

        <p className="text-muted-foreground">
          {"Modifier les informations de l'élément de navigation."}
        </p>
      </div>

      <FormulaireMenuItem
        action={modifierMenuItemAction.bind(null, menuItem.id)}
        texteBouton="Enregistrer"
        pages={pages}
        parentsParMenu={{
          [Menu.EN_TETE]: parentsEnTete,
          [Menu.PIED_DE_PAGE]: parentsPiedDePage,
        }}
        menuItem={{
          menu: menuItem.menu,
          parentId: menuItem.parentId,
          libelle: menuItem.libelle,
          pageId: menuItem.pageId,
          url: menuItem.url,
          ordre: menuItem.ordre,
          nouvelOnglet: menuItem.nouvelOnglet,
          actif: menuItem.actif,
        }}
      />
    </div>
  );
}
