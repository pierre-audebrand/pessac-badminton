import { creerUtilisateurAction } from "@/actions/utilisateur.actions";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { FormulaireUtilisateur } from "@/components/gestion/utilisateurs/formulaire-utilisateur";

export default async function NouvelUtilisateurPage() {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvel utilisateur</h1>

        <p className="text-muted-foreground">
          {"Création d'un nouveau compte."}
        </p>
      </div>

      <FormulaireUtilisateur
        action={creerUtilisateurAction}
        texteBouton="Créer l'utilisateur"
        afficherMotDePasse
      />
    </div>
  );
}
