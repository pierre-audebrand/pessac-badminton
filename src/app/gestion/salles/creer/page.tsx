import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerSalleAction } from "@/actions/salle.actions";

import { FormulaireSalle } from "@/components/gestion/salles/formulaire-salle";

export default async function NouvelleSallePage() {
  await exigerPermission(Permissions.SALLES_GERER.code);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvelle salle</h1>

        <p className="text-muted-foreground">Créer une nouvelle salle.</p>
      </div>

      <FormulaireSalle action={creerSalleAction} texteBouton="Créer la salle" />
    </div>
  );
}
