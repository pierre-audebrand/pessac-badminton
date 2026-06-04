import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { RoleRecherche } from "@/services/role.service";

import { RoleActions } from "./actions";

interface RoleCardProps {
  role: RoleRecherche;
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{role.nom}</h3>

            {role.systeme && <Badge variant="secondary">Système</Badge>}
          </div>

          <p className="text-sm text-muted-foreground">
            {role.description ?? "Aucune description"}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Permissions</p>

          <div className="flex flex-wrap gap-2">
            {role.permissions.map((rolePermission) => (
              <Badge key={rolePermission.permission.id} variant="outline">
                {rolePermission.permission.libelle}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {role._count.utilisateurs} utilisateur
            {role._count.utilisateurs > 1 ? "s" : ""}
          </p>
        </div>

        <RoleActions role={role} />
      </CardContent>
    </Card>
  );
}
