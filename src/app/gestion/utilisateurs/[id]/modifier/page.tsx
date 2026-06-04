import { notFound } from "next/navigation";

import { modifierUtilisateurAction } from "@/actions/utilisateur.actions";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { recupererUtilisateurParId } from "@/services/utilisateur.service";

import { FormulaireUtilisateur } from "@/components/gestion/utilisateurs/formulaire-utilisateur";
import { formaterDateInput } from "@/lib/dates";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierUtilisateurPage({ params }: Props) {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const { id } = await params;

  const utilisateur = await recupererUtilisateurParId(id);

  if (!utilisateur) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{"Modifier l'utilisateur"}</h1>

        <p className="text-muted-foreground">
          Modifiez les informations du compte.
        </p>
      </div>

      <FormulaireUtilisateur
        action={modifierUtilisateurAction.bind(null, utilisateur.id)}
        utilisateur={{
          prenom: utilisateur.prenom,
          nom: utilisateur.nom,
          dateNaissance: formaterDateInput(utilisateur.dateNaissance),
          email: utilisateur.email,
          actif: utilisateur.actif,
        }}
        texteBouton="Enregistrer"
        afficherActif
      />
    </div>
  );
}
