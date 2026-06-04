import { notFound } from "next/navigation";

import { modifierRoleAction } from "@/actions/role.actions";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { recupererRoleParId } from "@/services/role.service";
import { listerPermissions } from "@/services/permission.service";

import { FormulaireRole } from "@/components/gestion/roles/formulaire-role";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierRolePage({ params }: Props) {
  await exigerPermission(Permissions.ROLES_GERER.code);

  const { id } = await params;

  const role = await recupererRoleParId(id);

  if (!role) {
    notFound();
  }

  const permissions = await listerPermissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier le rôle</h1>

        <p className="text-muted-foreground">
          Modifiez les informations du rôle.
        </p>
      </div>

      <FormulaireRole
        action={modifierRoleAction.bind(null, role.id)}
        role={{
          nom: role.nom,
          description: role.description,
          permissions: role.permissions.map(
            (rolePermission) => rolePermission.permissionId,
          ),
        }}
        permissions={permissions}
        texteBouton="Enregistrer"
      />
    </div>
  );
}
