import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { PermissionRecherche } from "@/services/permission.service";

interface PermissionCardProps {
  permission: PermissionRecherche;
}

export function PermissionCard({ permission }: PermissionCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h3 className="font-semibold">{permission.libelle}</h3>

          <p className="text-sm text-muted-foreground">{permission.code}</p>
        </div>

        {permission.description && (
          <p className="text-sm">{permission.description}</p>
        )}

        <div>
          <p className="mb-2 text-sm font-medium">Rôles associés</p>

          <div className="flex flex-wrap gap-2">
            {permission.roles.length > 0 ? (
              permission.roles.map((rolePermission) => (
                <Badge key={rolePermission.role.id} variant="outline">
                  {rolePermission.role.nom}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Aucun rôle</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
