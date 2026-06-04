import { creerRoleAction } from "@/actions/role.actions";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { listerPermissions } from "@/services/permission.service";

import { FormulaireRole } from "@/components/gestion/roles/formulaire-role";

export default async function NouveauRolePage() {
  await exigerPermission(Permissions.ROLES_GERER.code);

  const permissions = await listerPermissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau rôle</h1>

        <p className="text-muted-foreground">{"Création d'un nouveau rôle."}</p>
      </div>

      <FormulaireRole
        action={creerRoleAction}
        permissions={permissions}
        texteBouton="Créer le rôle"
      />
    </div>
  );
}
