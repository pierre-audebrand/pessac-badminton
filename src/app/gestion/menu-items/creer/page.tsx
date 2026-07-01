import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerMenuItemAction } from "@/actions/menu-item.actions";

import { listerPages } from "@/services/page.service";
import { listerParentsMenuItems } from "@/services/menu-item.service";

import { FormulaireMenuItem } from "@/components/gestion/menu-items/formulaire-menu-item";
import { Menu } from "@prisma/client";
import { SearchParams } from "@/lib/liste-query";
import { lireMenuQuery } from "@/lib/menus";

type Props = {
  searchParams: SearchParams;
};

export default async function NouveauMenuItemPage({ searchParams }: Props) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const params = await searchParams;

  const menu = lireMenuQuery(params.menu);

  const [pages, parentsEnTete, parentsPiedDePage] = await Promise.all([
    listerPages(),
    listerParentsMenuItems(Menu.EN_TETE),
    listerParentsMenuItems(Menu.PIED_DE_PAGE),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvel élément de menu</h1>

        <p className="text-muted-foreground">
          Ajouter un nouvel élément de navigation au site.
        </p>
      </div>

      <FormulaireMenuItem
        action={creerMenuItemAction}
        pages={pages}
        parentsParMenu={{
          [Menu.EN_TETE]: parentsEnTete,
          [Menu.PIED_DE_PAGE]: parentsPiedDePage,
        }}
        afficherSelectionMenu={false}
        menuParDefaut={menu}
        texteBouton="Créer l'élément"
      />
    </div>
  );
}
