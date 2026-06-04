import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { modifierGroupeAction } from "@/actions/groupe.actions";

import { recupererGroupeParId } from "@/services/groupe.service";

import { FormulaireGroupe } from "@/components/gestion/groupes/formulaire-groupe";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierGroupePage({ params }: Props) {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  const { id } = await params;

  const groupe = await recupererGroupeParId(id);

  if (!groupe) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier le groupe</h1>

        <p className="text-muted-foreground">
          Modifier les informations du groupe.
        </p>
      </div>

      <FormulaireGroupe
        action={modifierGroupeAction.bind(null, groupe.id)}
        texteBouton="Enregistrer"
        afficherActif
        groupe={{
          nom: groupe.nom,
          description: groupe.description,
          ageMin: groupe.ageMin,
          ageMax: groupe.ageMax,
          actif: groupe.actif,
        }}
      />
    </div>
  );
}
