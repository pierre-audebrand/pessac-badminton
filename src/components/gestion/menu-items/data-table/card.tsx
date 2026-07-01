import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { MenuItemRecherche } from "@/services/menu-item.service";

import { MenuItemActions } from "./actions";
import { libelleMenu } from "@/lib/menus";

interface Props {
  menuItem: MenuItemRecherche;
}

export function MenuItemCard({ menuItem }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{menuItem.libelle}</h3>

          {menuItem.actif ? (
            <Badge>Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Menu :</span>{" "}
            {libelleMenu(menuItem.menu)}
          </p>

          <p>
            <span className="text-muted-foreground">Type :</span>{" "}
            {menuItem.type}
          </p>

          <p>
            <span className="text-muted-foreground">Parent :</span>{" "}
            {menuItem.parent?.libelle ?? "-"}
          </p>

          <p>
            <span className="text-muted-foreground">Cible :</span>{" "}
            {menuItem.page?.titre ?? menuItem.url ?? "-"}
          </p>

          <p>
            <span className="text-muted-foreground">Ordre :</span>{" "}
            {menuItem.ordre}
          </p>
        </div>

        <MenuItemActions menuItem={menuItem} />
      </CardContent>
    </Card>
  );
}
