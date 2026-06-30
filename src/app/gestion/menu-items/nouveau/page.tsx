import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerMenuItemAction } from "@/actions/menu-item.actions";

import { listerPages } from "@/services/page.service";
import { listerParentsMenuItems } from "@/services/menu-item.service";

import { FormulaireMenuItem } from "@/components/gestion/menu-items/formulaire-menu-item";

export default async function NouveauMenuItemPage() {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const [pages, parents] = await Promise.all([
    listerPages(),
    listerParentsMenuItems(),
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
        parents={parents}
        texteBouton="Créer l'élément"
      />
    </div>
  );
}
