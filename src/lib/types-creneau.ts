import { TypeCreneau } from "@prisma/client";

export const typesCreneau = {
  [TypeCreneau.ENTRAINEMENT]: {
    libelle: "Entraînement",
  },

  [TypeCreneau.JEU_LIBRE]: {
    libelle: "Jeu libre",
  },
} satisfies Record<
  TypeCreneau,
  {
    libelle: string;
  }
>;
