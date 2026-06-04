import { PlanningTimelineGrid } from "./planning-timeline-grid";
import { PlanningTimelineMobileHeader } from "./planning-timeline-header-mobile";
import { PlanningTimelineRow } from "./planning-timeline-row";

import type { PlanningSalleTimeline } from "@/services/planning.service";

interface Props {
  planningSalle: PlanningSalleTimeline;

  debut: string;
  fin: string;
}

export function PlanningRow({ planningSalle, debut, fin }: Props) {
  return (
    <div className="rounded-md border bg-muted/10">
      <div className="md:flex">
        {/* Salle desktop */}
        <div className="hidden md:flex md:w-[180px] md:flex-shrink-0 md:border-r">
          <div className="flex w-full items-center px-3 font-medium">
            {planningSalle.salle.nom}
          </div>
        </div>

        {/* Salle mobile */}
        <div className="border-b p-3 font-medium md:hidden">
          {planningSalle.salle.nom}
        </div>

        {/* Timeline */}
        <div className="flex-1 min-w-0">
          <div className="overflow-x-auto touch-pan-x">
            <div className="min-w-[500px]">
              <div className="border-b px-2 py-1 md:hidden">
                <PlanningTimelineMobileHeader debut={debut} fin={fin} />
              </div>

              <div className="relative">
                <PlanningTimelineGrid debut={debut} fin={fin} />

                {planningSalle.tracks.map((track, index) => (
                  <PlanningTimelineRow
                    key={index}
                    debut={debut}
                    fin={fin}
                    creneaux={track.creneaux}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
