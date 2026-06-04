import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { recupererUtilisateurParId } from "@/services/utilisateur.service";
import { listerGroupesActifs } from "@/services/groupe.service";

import { FormulaireGroupesUtilisateur } from "@/components/gestion/utilisateurs/formulaire-groupes-utilisateur";

import { modifierGroupesUtilisateurAction } from "@/actions/groupe-utilisateur.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupesUtilisateurPage({ params }: Props) {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const { id } = await params;

  const utilisateur = await recupererUtilisateurParId(id);

  if (!utilisateur) {
    notFound();
  }

  const groupes = await listerGroupesActifs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Groupes utilisateur</h1>

        <p className="text-muted-foreground">
          Gérez les groupes de {utilisateur.prenom} {utilisateur.nom}.
        </p>
      </div>

      <FormulaireGroupesUtilisateur
        action={modifierGroupesUtilisateurAction.bind(null, utilisateur.id)}
        utilisateur={{
          groupes: utilisateur.groupes.map(
            (utilisateurGroupe) => utilisateurGroupe.groupeId,
          ),
        }}
        groupes={groupes}
        texteBouton="Enregistrer"
      />
    </div>
  );
}
