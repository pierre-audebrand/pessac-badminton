import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { creerIndisponibiliteAction } from "@/actions/indisponibilite.actions";

import { listerSallesActives } from "@/services/salle.service";

import { FormulaireIndisponibilite } from "@/components/gestion/indisponibilites/formulaire-indisponibilite";

type Props = {
  searchParams: Promise<{
    salleId?: string;
  }>;
};

export default async function NouvelleIndisponibilitePage({
  searchParams,
}: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const { salleId } = await searchParams;

  const salles = await listerSallesActives();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvelle indisponibilité</h1>

        <p className="text-muted-foreground">
          Déclarer une indisponibilité de salle.
        </p>
      </div>

      <FormulaireIndisponibilite
        action={creerIndisponibiliteAction}
        salles={salles}
        texteBouton="Créer l'indisponibilité"
        indisponibilite={{
          salleId,
        }}
      />
    </div>
  );
}
