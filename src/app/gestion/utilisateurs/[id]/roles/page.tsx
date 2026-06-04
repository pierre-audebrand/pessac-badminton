import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { recupererUtilisateurParId } from "@/services/utilisateur.service";
import { listerRoles as listerRoles } from "@/services/role.service";

import { FormulaireRolesUtilisateur } from "@/components/gestion/utilisateurs/formulaire-roles-utilisateur";
import { modifierRolesUtilisateurAction } from "@/actions/role-utilisateur.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RolesUtilisateurPage({ params }: Props) {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const { id } = await params;

  const utilisateur = await recupererUtilisateurParId(id);

  if (!utilisateur) {
    notFound();
  }

  const roles = await listerRoles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rôles utilisateur</h1>

        <p className="text-muted-foreground">
          Gérez les rôles de {utilisateur.prenom} {utilisateur.nom}.
        </p>
      </div>

      <FormulaireRolesUtilisateur
        action={modifierRolesUtilisateurAction.bind(null, utilisateur.id)}
        utilisateur={{
          roles: utilisateur.roles.map(
            (utilisateurRole) => utilisateurRole.roleId,
          ),
        }}
        roles={roles}
        texteBouton="Enregistrer"
      />
    </div>
  );
}
