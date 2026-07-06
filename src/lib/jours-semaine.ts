import { JourSemaine } from "@prisma/client";

export const joursSemaine = {
  [JourSemaine.LUNDI]: {
    numeroJs: 1,
    libelle: "Lundi",
    libelleCourt: "Lun.",
  },

  [JourSemaine.MARDI]: {
    numeroJs: 2,
    libelle: "Mardi",
    libelleCourt: "Mar.",
  },

  [JourSemaine.MERCREDI]: {
    numeroJs: 3,
    libelle: "Mercredi",
    libelleCourt: "Mer.",
  },

  [JourSemaine.JEUDI]: {
    numeroJs: 4,
    libelle: "Jeudi",
    libelleCourt: "Jeu.",
  },

  [JourSemaine.VENDREDI]: {
    numeroJs: 5,
    libelle: "Vendredi",
    libelleCourt: "Ven.",
  },

  [JourSemaine.SAMEDI]: {
    numeroJs: 6,
    libelle: "Samedi",
    libelleCourt: "Sam.",
  },

  [JourSemaine.DIMANCHE]: {
    numeroJs: 0,
    libelle: "Dimanche",
    libelleCourt: "Dim.",
  },
} satisfies Record<
  JourSemaine,
  {
    numeroJs: number;
    libelle: string;
    libelleCourt: string;
  }
>;
