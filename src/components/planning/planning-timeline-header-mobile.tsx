import {
  construireGraduationsTimeline,
  GraduationPlanning,
} from "@/lib/planning";
import { cn } from "@/lib/utils";

interface Props {
  debut: string;
  fin: string;
}

export function PlanningTimelineMobileHeader({ debut, fin }: Props) {
  const graduations = construireGraduationsTimeline(debut, fin).filter(
    (_, index) => index % 2 === 0,
  );

  return (
    <div className="relative h-5">
      {graduations.map(({ heure, position, alignement }) => (
        <div
          key={heure}
          className={cn(
            "absolute text-[10px] tabular-nums text-muted-foreground",
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
