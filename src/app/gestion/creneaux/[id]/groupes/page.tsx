import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { recupererCreneauParId } from "@/services/creneau.service";
import { listerGroupesActifs } from "@/services/groupe.service";

import { FormulaireGroupesCreneau } from "@/components/gestion/creneaux/formulaire-groupes-creneau";

import { modifierGroupesCreneauAction } from "@/actions/groupe-creneau.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupesCreneauPage({ params }: Props) {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const { id } = await params;

  const creneau = await recupererCreneauParId(id);

  if (!creneau) {
    notFound();
  }

  const groupes = await listerGroupesActifs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Groupes du créneau</h1>

        <p className="text-muted-foreground">
          Gérez les groupes associés à ce créneau.
        </p>
      </div>

      <FormulaireGroupesCreneau
        action={modifierGroupesCreneauAction.bind(null, creneau.id)}
        creneau={{
          groupes: creneau.groupes.map(
            (groupeCreneau) => groupeCreneau.groupeId,
          ),
        }}
        groupes={groupes}
        texteBouton="Enregistrer"
      />
    </div>
  );
}
