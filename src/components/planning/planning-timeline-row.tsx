import { PlanningTimelineBloc } from "./planning-timeline-bloc";

import type { CreneauDetail } from "@/services/creneau.service";

interface Props {
  debut: string;
  fin: string;

  creneaux: CreneauDetail[];
}

export function PlanningTimelineRow({ debut, fin, creneaux }: Props) {
  return (
    <div className="relative h-10 md:h-9">
      {creneaux.map((creneau) => (
        <PlanningTimelineBloc
          key={creneau.id}
          creneau={creneau}
          debutTimeline={debut}
          finTimeline={fin}
        />
      ))}
    </div>
  );
}
