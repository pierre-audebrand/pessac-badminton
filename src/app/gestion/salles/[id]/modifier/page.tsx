import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { modifierSalleAction } from "@/actions/salle.actions";

import { recupererSalleParId } from "@/services/salle.service";

import { FormulaireSalle } from "@/components/gestion/salles/formulaire-salle";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierSallePage({ params }: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const { id } = await params;

  const salle = await recupererSalleParId(id);

  if (!salle) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier la salle</h1>

        <p className="text-muted-foreground">
          Modifier les informations de la salle.
        </p>
      </div>

      <FormulaireSalle
        action={modifierSalleAction.bind(null, salle.id)}
        texteBouton="Enregistrer"
        afficherActif
        salle={{
          nom: salle.nom,
          adresse: salle.adresse,
          codePostal: salle.codePostal,
          ville: salle.ville,
          actif: salle.actif,
        }}
      />
    </div>
  );
}
