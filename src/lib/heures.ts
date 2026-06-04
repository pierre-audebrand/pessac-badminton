export function heureVersMinutes(heure: string) {
  const [h, m] = heure.split(":").map(Number);

  return h * 60 + m;
}

export function dureeHeure(heureDebut: string, heureFin: string) {
  return heureVersMinutes(heureFin) - heureVersMinutes(heureDebut);
}
