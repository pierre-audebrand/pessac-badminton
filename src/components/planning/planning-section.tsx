import { joursSemaine } from "@/lib/jours-semaine";

import { PlanningJourTimeline } from "@/services/planning.service";

import { PageSection } from "@/components/ui/page/page-section";

import { PlanningTimelineHeader } from "./planning-timeline-header";
import { PlanningRow } from "./planning-row";

interface Props {
  titre: string;

  debut: string;
  fin: string;

  planning: PlanningJourTimeline[];
}

export function PlanningSection({ titre, debut, fin, planning }: Props) {
  return (
    <PageSection title={`${titre} (${debut} - ${fin})`} bordered={false}>
      <div className="space-y-4">
        <div className="hidden md:block">
          <PlanningTimelineHeader debut={debut} fin={fin} />
        </div>

        {planning.map((jour) => (
          <div key={jour.jour} className="space-y-3 md:space-y-4">
            {/* Mobile */}
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground md:hidden">
              {joursSemaine[jour.jour].libelle}
            </h3>

            {jour.salles.map((planningSalle, index) => (
              <div
                key={`${jour.jour}-${planningSalle.salle.id}`}
                className="md:flex md:gap-4"
              >
                <div className="hidden md:block md:w-[120px] md:flex-shrink-0">
                  {index === 0 ? joursSemaine[jour.jour].libelle : null}
                </div>

                <div className="min-w-0 flex-1">
                  <PlanningRow
                    planningSalle={planningSalle}
                    debut={debut}
                    fin={fin}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PageSection>
  );
}
