import z from "zod";

export type FormState<TChamps extends string> = {
  erreurs?: Partial<Record<TChamps, string[]>>;
  message?: string;
  succes?: boolean;
};

export type ErreursFormulaire = Record<string, string[]>;

export function ajouterErreur(
  erreurs: ErreursFormulaire,
  champ: string,
  message: string,
): ErreursFormulaire {
  erreurs[champ] ??= [];
  erreurs[champ].push(message);
  return erreurs;
}

export function ajouterErreursZod(
  erreurs: ErreursFormulaire,
  issues: z.ZodError["issues"],
): ErreursFormulaire {
  for (const issue of issues) {
    const champ = issue.path[0];

    if (typeof champ !== "string") {
      continue;
    }

    ajouterErreur(erreurs, champ, issue.message);
  }

  return erreurs;
}

export function construireErreur(
  champ: string,
  message: string,
): ErreursFormulaire {
  return {
    [champ]: [message],
  };
}

export function construireErreurException(error: unknown): {
  message?: string;
} {
  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Une erreur est survenue" };
}
