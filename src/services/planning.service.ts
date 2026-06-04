import { JourSemaine, Salle } from "@prisma/client";
import { CreneauDetail, listerCreneauxActifs } from "./creneau.service";
import { HEURE_SEPARATION_JOURNEE } from "@/lib/planning";

export interface PlanningTrack {
  creneaux: CreneauDetail[];
}

export interface PlanningSalleTimeline {
  salle: Salle;
  tracks: PlanningTrack[];
}

export interface PlanningJourTimeline {
  jour: JourSemaine;

  salles: PlanningSalleTimeline[];
}

export interface PlanningSalle {
  salle: Salle;

  creneaux: CreneauDetail[];
}

export interface PlanningJour {
  jour: JourSemaine;

  salles: PlanningSalle[];
}

export interface PeriodePlanning {
  titre: string;
  debut: string;
  fin: string;
  planning: PlanningJourTimeline[];
}

export function construirePeriodePlanning(
  planning: PlanningJour[],
  titre: string,
  filtre: (creneau: CreneauDetail) => boolean,
): PeriodePlanning {
  const planningFiltre = filtrerPlanning(planning, filtre);

  return {
    titre,

    debut: recupererHeureMin(planningFiltre),
    fin: recupererHeureMax(planningFiltre),

    planning: construirePlanningTimeline(planningFiltre),
  };
}

function construirePlanningHebdomadaire(
  creneaux: CreneauDetail[],
): PlanningJour[] {
  const planningParJour = new Map<JourSemaine, Map<string, PlanningSalle>>();

  for (const creneau of creneaux) {
    let sallesDuJour = planningParJour.get(creneau.jourSemaine);

    if (!sallesDuJour) {
      sallesDuJour = new Map();

      planningParJour.set(creneau.jourSemaine, sallesDuJour);
    }

    let planningSalle = sallesDuJour.get(creneau.salle.id);

    if (!planningSalle) {
      planningSalle = {
        salle: creneau.salle,
        creneaux: [],
      };

      sallesDuJour.set(creneau.salle.id, planningSalle);
    }

    planningSalle.creneaux.push(creneau);
  }

  const jours = Object.values(JourSemaine);

  return jours
    .map((jour) => ({
      jour,

      salles: Array.from(planningParJour.get(jour)?.values() ?? [])
        .sort((a, b) => a.salle.nom.localeCompare(b.salle.nom))
        .map((planningSalle) => ({
          ...planningSalle,

          creneaux: planningSalle.creneaux.sort((a, b) =>
            a.heureDebut.localeCompare(b.heureDebut),
          ),
        })),
    }))
    .filter((jour) => jour.salles.length > 0);
}

export async function recupererPlanningHebdomadaire(): Promise<PlanningJour[]> {
  const creneaux = await listerCreneauxActifs();

  return construirePlanningHebdomadaire(creneaux);
}

export function estCreneauMatin(creneau: CreneauDetail) {
  return creneau.heureDebut < HEURE_SEPARATION_JOURNEE;
}

export function estCreneauSoir(creneau: CreneauDetail) {
  return creneau.heureFin > HEURE_SEPARATION_JOURNEE;
}

type FiltreCreneau = (creneau: CreneauDetail) => boolean;

export function filtrerPlanning(
  planning: PlanningJour[],
  filtre: FiltreCreneau,
): PlanningJour[] {
  return planning
    .map((jour) => ({
      ...jour,

      salles: jour.salles
        .map((salle) => ({
          ...salle,

          creneaux: salle.creneaux.filter(filtre),
        }))
        .filter((salle) => salle.creneaux.length > 0),
    }))
    .filter((jour) => jour.salles.length > 0);
}

export function construireTracks(creneaux: CreneauDetail[]): PlanningTrack[] {
  const tracks: CreneauDetail[][] = [];

  const tries = [...creneaux].sort((a, b) =>
    a.heureDebut.localeCompare(b.heureDebut),
  );

  for (const creneau of tries) {
    let place = false;

    for (const track of tracks) {
      const dernier = track.at(-1);

      if (dernier && dernier.heureFin <= creneau.heureDebut) {
        track.push(creneau);
        place = true;
        break;
      }
    }

    if (!place) {
      tracks.push([creneau]);
    }
  }

  return tracks.map((creneaux) => ({
    creneaux,
  }));
}

export function construirePlanningTimeline(planning: PlanningJour[]) {
  return planning.map((jour) => ({
    jour: jour.jour,

    salles: jour.salles.map((salle) => ({
      salle: salle.salle,

      tracks: construireTracks(salle.creneaux),
    })),
  }));
}

export function recupererHeureMin(planning: PlanningJour[]): string {
  let heureMin: string | null = null;

  for (const jour of planning) {
    for (const salle of jour.salles) {
      for (const creneau of salle.creneaux) {
        if (!heureMin || creneau.heureDebut < heureMin) {
          heureMin = creneau.heureDebut;
        }
      }
    }
  }

  return heureMin ?? "08:00";
}

export function recupererHeureMax(planning: PlanningJour[]): string {
  let heureMax: string | null = null;

  for (const jour of planning) {
    for (const salle of jour.salles) {
      for (const creneau of salle.creneaux) {
        if (!heureMax || creneau.heureFin > heureMax) {
          heureMax = creneau.heureFin;
        }
      }
    }
  }

  return heureMax ?? "23:00";
}
