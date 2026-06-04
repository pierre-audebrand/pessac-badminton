import { CreneauDetail } from "@/services/creneau.service";

export function PlanningTimelineBlocDetails({
  creneau,
}: {
  creneau: CreneauDetail;
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="space-y-1">
          {creneau.groupes.map(({ groupe }) => (
            <div key={groupe.id} className="flex items-center gap-2">
              <span className="font-medium">{groupe.nom}</span>

              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: groupe.couleur ?? "#64748B",
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          {creneau.heureDebut} → {creneau.heureFin}
        </div>
      </div>

      <div className="text-sm">
        <span className="font-medium">Salle :</span> {creneau.salle.nom}
      </div>
    </div>
  );
}
