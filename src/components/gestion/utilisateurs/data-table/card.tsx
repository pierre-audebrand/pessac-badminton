import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { UtilisateurRecherche } from "@/services/utilisateur.service";
import { UtilisateurActions } from "./actions";
import { formaterDate } from "@/lib/dates";
import { calculerAge } from "@/lib/utilisateurs";

interface UtilisateurCardProps {
  utilisateur: UtilisateurRecherche;
  utilisateurConnecteId: string;
}

export function UtilisateurCard({
  utilisateur,
  utilisateurConnecteId,
}: UtilisateurCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="font-semibold">
            {utilisateur.prenom} {utilisateur.nom}
          </div>

          {utilisateur.dateNaissance && (
            <div className="text-sm text-muted-foreground">
              {calculerAge(utilisateur.dateNaissance)} ans (
              {formaterDate(utilisateur.dateNaissance)})
            </div>
          )}

          <div className="text-muted-foreground text-sm">
            {utilisateur.email}
          </div>
        </div>

        <div>
          {utilisateur.actif ? (
            <Badge>Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          )}
        </div>

        {utilisateur.groupes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {utilisateur.groupes.map((utilisateurGroupe) => (
              <Badge key={utilisateurGroupe.groupe.id}>
                {utilisateurGroupe.groupe.nom}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {utilisateur.roles.map((roleUtilisateur) => (
            <Badge key={roleUtilisateur.role.id} variant="outline">
              {roleUtilisateur.role.nom}
            </Badge>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          Créé le {formaterDate(utilisateur.createdAt)}
        </div>

        <UtilisateurActions
          utilisateur={utilisateur}
          utilisateurConnecteId={utilisateurConnecteId}
        />
      </CardContent>
    </Card>
  );
}
