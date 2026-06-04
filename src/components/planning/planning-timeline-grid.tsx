import { construireGraduationsTimeline } from "@/lib/planning";

interface Props {
  debut: string;
  fin: string;
}

export function PlanningTimelineGrid({ debut, fin }: Props) {
  const graduations = construireGraduationsTimeline(debut, fin);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {graduations.slice(1, -1).map(({ heure, position }) => (
        <div
          key={heure}
          className="absolute top-0 bottom-0 w-px bg-border"
          style={{
            left: `${position}%`,
          }}
        />
      ))}
    </div>
  );
}
