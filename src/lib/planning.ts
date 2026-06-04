import { heureVersMinutes } from "./heures";

export const HEURE_SEPARATION_JOURNEE = "14:00";

export function genererGraduations(debut: string, fin: string): string[] {
  const resultat: string[] = [];

  let minutes = heureVersMinutes(debut);
  const finMinutes = heureVersMinutes(fin);

  while (minutes <= finMinutes) {
    const heure = Math.floor(minutes / 60);
    const minute = minutes % 60;

    resultat.push(
      `${heure.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`,
    );

    minutes += 30;
  }

  if (resultat[resultat.length - 1] !== fin) {
    resultat.push(fin);
  }

  return resultat;
}

export function calculerPositionTimeline(
  heure: string,
  debut: string,
  fin: string,
): number {
  const minutes = heureVersMinutes(heure);

  const debutMinutes = heureVersMinutes(debut);

  const finMinutes = heureVersMinutes(fin);

  return ((minutes - debutMinutes) / (finMinutes - debutMinutes)) * 100;
}

export function calculerBlocTimeline(
  heureDebut: string,
  heureFin: string,
  debutTimeline: string,
  finTimeline: string,
) {
  const left = calculerPositionTimeline(heureDebut, debutTimeline, finTimeline);

  const right = calculerPositionTimeline(heureFin, debutTimeline, finTimeline);

  return {
    left,
    width: right - left,
  };
}

export interface GraduationPlanning {
  heure: string;
  position: number;

  alignement: "start" | "center" | "end";
}

export function construireGraduationsTimeline(
  debut: string,
  fin: string,
): GraduationPlanning[] {
  return genererGraduations(debut, fin).map((heure) => {
    let alignement: GraduationPlanning["alignement"] = "center";

    if (heure === debut) {
      alignement = "start";
    } else if (heure === fin) {
      alignement = "end";
    }

    return {
      heure,
      position: calculerPositionTimeline(heure, debut, fin),
      alignement,
    };
  });
}
