import {
  construireGraduationsTimeline,
  GraduationPlanning,
} from "@/lib/planning";
import { cn } from "@/lib/utils";

interface Props {
  debut: string;
  fin: string;
}

export function PlanningTimelineHeader({ debut, fin }: Props) {
  const graduations = construireGraduationsTimeline(debut, fin);

  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 border-b pb-2">
      <div className="text-sm font-medium text-muted-foreground">Jour</div>

      <div className="grid grid-cols-[180px_1fr]">
        <div className="text-sm font-medium text-muted-foreground">Salle</div>

        <div className="relative h-5">
          {graduations.map(({ heure, position, alignement }) => (
            <div
              key={heure}
              className={cn(
                "absolute text-xs tabular-nums text-muted-foreground",
                classesAlignementGraduation(alignement),
              )}
              style={{
                left: `${position}%`,
              }}
            >
              {heure}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function classesAlignementGraduation(
  alignement: GraduationPlanning["alignement"],
) {
  switch (alignement) {
    case "start":
      return "translate-x-0";

    case "center":
      return "-translate-x-1/2";

    case "end":
      return "-translate-x-full";
  }
}
