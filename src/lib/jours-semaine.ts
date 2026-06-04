import { JourSemaine } from "@prisma/client";

export const joursSemaine = {
  LUNDI: {
    numeroJs: 1,
    libelle: "Lundi",
    libelleCourt: "Lun.",
  },

  MARDI: {
    numeroJs: 2,
    libelle: "Mardi",
    libelleCourt: "Mar.",
  },

  MERCREDI: {
    numeroJs: 3,
    libelle: "Mercredi",
    libelleCourt: "Mer.",
  },

  JEUDI: {
    numeroJs: 4,
    libelle: "Jeudi",
    libelleCourt: "Jeu.",
  },

  VENDREDI: {
    numeroJs: 5,
    libelle: "Vendredi",
    libelleCourt: "Ven.",
  },

  SAMEDI: {
    numeroJs: 6,
    libelle: "Samedi",
    libelleCourt: "Sam.",
  },

  DIMANCHE: {
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
