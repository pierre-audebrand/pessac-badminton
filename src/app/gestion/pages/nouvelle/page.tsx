import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerPageAction } from "@/actions/page.actions";

import { FormulairePage } from "@/components/gestion/pages/formulaire-page";

export default async function NouvellePagePage() {
  await exigerPermission(Permissions.PAGES_GERER.code);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvelle page</h1>

        <p className="text-muted-foreground">
          Créer une nouvelle page du site.
        </p>
      </div>

      <FormulairePage action={creerPageAction} texteBouton="Créer la page" />
    </div>
  );
}
