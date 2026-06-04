import { PlanningSection } from "@/components/planning/planning-section";
import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import {
  construirePeriodePlanning,
  estCreneauMatin,
  estCreneauSoir,
  recupererPlanningHebdomadaire,
} from "@/services/planning.service";

export default async function PlanningCreneauxPage() {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const planning = await recupererPlanningHebdomadaire();

  const periodeMatin = construirePeriodePlanning(
    planning,
    "MATIN",
    estCreneauMatin,
  );

  const periodeSoir = construirePeriodePlanning(
    planning,
    "SOIR",
    estCreneauSoir,
  );

  return (
    <div className="space-y-10">
      <PlanningSection {...periodeMatin} />

      <PlanningSection {...periodeSoir} />
    </div>
  );
}
