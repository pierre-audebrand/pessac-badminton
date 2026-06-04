import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { modifierIndisponibiliteAction } from "@/actions/indisponibilite.actions";

import { listerSallesActives } from "@/services/salle.service";
import { recupererIndisponibiliteParId } from "@/services/indisponibilite.service";

import { FormulaireIndisponibilite } from "@/components/gestion/indisponibilites/formulaire-indisponibilite";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTimeLocal(date: Date) {
  return date.toISOString().slice(0, 16);
}

export default async function ModifierIndisponibilitePage({ params }: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const { id } = await params;

  const [indisponibilite, salles] = await Promise.all([
    recupererIndisponibiliteParId(id),
    listerSallesActives(),
  ]);

  if (!indisponibilite) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{"Modifier l'indisponibilité"}</h1>

        <p className="text-muted-foreground">
          {"Modifier les informations de l'indisponibilité."}
        </p>
      </div>

      <FormulaireIndisponibilite
        action={modifierIndisponibiliteAction.bind(null, indisponibilite.id)}
        salles={salles}
        texteBouton="Enregistrer"
        indisponibilite={{
          salleId: indisponibilite.salleId,
          debut: formatDateTimeLocal(indisponibilite.debut),
          fin: formatDateTimeLocal(indisponibilite.fin),
          motif: indisponibilite.motif,
        }}
      />
    </div>
  );
}
