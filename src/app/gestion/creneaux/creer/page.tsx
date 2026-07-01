import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerCreneauAction } from "@/actions/creneau.actions";

import { FormulaireCreneau } from "@/components/gestion/creneaux/formulaire-creneau";

import { listerSallesActives } from "@/services/salle.service";

export default async function NouveauCreneauPage() {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const salles = await listerSallesActives();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau créneau</h1>

        <p className="text-muted-foreground">Créer un nouveau créneau.</p>
      </div>

      <FormulaireCreneau
        action={creerCreneauAction}
        salles={salles}
        texteBouton="Créer le créneau"
      />
    </div>
  );
}
