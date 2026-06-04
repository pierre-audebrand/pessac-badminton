import { calculerBlocTimeline } from "@/lib/planning";

import type { CreneauDetail } from "@/services/creneau.service";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { PlanningTimelineBlocDetails } from "./planning-timeline-bloc-details";

interface Props {
  creneau: CreneauDetail;

  debutTimeline: string;
  finTimeline: string;
}

export function PlanningTimelineBloc({
  creneau,
  debutTimeline,
  finTimeline,
}: Props) {
  const { left, width } = calculerBlocTimeline(
    creneau.heureDebut,
    creneau.heureFin,
    debutTimeline,
    finTimeline,
  );

  const couleur = recupererCouleurBloc(creneau);

  const triggerClasses = `
  absolute
  overflow-hidden
  rounded
  border
  px-2
  text-left
  text-foreground
  cursor-pointer
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
`;

  const style = {
    left: `${left}%`,
    width: `${width}%`,
    borderColor: couleur,
    backgroundColor: `${couleur}33`,
  };

  const groupes = creneau.groupes.map(({ groupe }) => groupe);
  const groupesLabel = groupes.map((groupe) => groupe.nom).join(", ");

  return (
    <>
      {/* Mobile */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`${triggerClasses} top-0.5 h-9 md:hidden`}
            style={style}
            aria-label={`${groupesLabel} de ${creneau.heureDebut} à ${creneau.heureFin}`}
          >
            <div className="truncate text-xs font-medium">{groupesLabel}</div>

            <div className="truncate text-[10px] opacity-80">
              {creneau.heureDebut} → {creneau.heureFin}
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="center"
          sideOffset={6}
          className="w-72"
        >
          <PlanningTimelineBlocDetails creneau={creneau} />
        </PopoverContent>
      </Popover>

      {/* Desktop */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${triggerClasses} hidden md:block top-0 md:top-0 h-8`}
            style={style}
            aria-label={`${groupesLabel} de ${creneau.heureDebut} à ${creneau.heureFin}`}
          >
            <div className="truncate text-xs font-medium">{groupesLabel}</div>

            <div className="truncate text-[10px] opacity-80">
              {creneau.heureDebut} → {creneau.heureFin}
            </div>
          </button>
        </TooltipTrigger>

        <TooltipContent side="top" className="w-72">
          <PlanningTimelineBlocDetails creneau={creneau} />
        </TooltipContent>
      </Tooltip>
    </>
  );
}

function recupererCouleurBloc(creneau: CreneauDetail) {
  return creneau.groupes[0]?.groupe.couleur ?? "#64748B";
}
