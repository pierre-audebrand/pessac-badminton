import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerGroupeAction } from "@/actions/groupe.actions";

import { FormulaireGroupe } from "@/components/gestion/groupes/formulaire-groupe";

export default async function NouveauGroupePage() {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau groupe</h1>

        <p className="text-muted-foreground">Créer un nouveau groupe.</p>
      </div>

      <FormulaireGroupe
        action={creerGroupeAction}
        texteBouton="Créer le groupe"
      />
    </div>
  );
}
