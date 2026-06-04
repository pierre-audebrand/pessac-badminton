import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { modifierCreneauAction } from "@/actions/creneau.actions";

import { FormulaireCreneau } from "@/components/gestion/creneaux/formulaire-creneau";

import { recupererCreneauParId } from "@/services/creneau.service";

import { listerSallesActives } from "@/services/salle.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierCreneauPage({ params }: Props) {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const { id } = await params;

  const [creneau, salles] = await Promise.all([
    recupererCreneauParId(id),
    listerSallesActives(),
  ]);

  if (!creneau) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier le créneau</h1>

        <p className="text-muted-foreground">
          Modifier les informations du créneau.
        </p>
      </div>

      <FormulaireCreneau
        action={modifierCreneauAction.bind(null, creneau.id)}
        salles={salles}
        afficherActif
        texteBouton="Enregistrer"
        creneau={{
          salleId: creneau.salleId,
          jourSemaine: creneau.jourSemaine,
          heureDebut: creneau.heureDebut,
          heureFin: creneau.heureFin,
          type: creneau.type,
          actif: creneau.actif,
        }}
      />
    </div>
  );
}
