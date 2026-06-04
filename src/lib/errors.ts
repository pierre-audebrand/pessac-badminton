export class EntiteIntrouvableError extends Error {
  constructor(public entite: string) {
    super(`${entite} introuvable`);
  }
}
