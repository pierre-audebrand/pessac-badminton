import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function formaterDate(date: Date) {
  return format(date, "dd/MM/yyyy", {
    locale: fr,
  });
}

export function formaterDateHeure(date: Date) {
  return format(date, "dd/MM/yyyy HH:mm", {
    locale: fr,
  });
}

export function formaterDateInput(date?: Date | null) {
  if (!date) {
    return "";
  }

  return format(date, "yyyy-MM-dd");
}

export function formaterDateRelative(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr,
  });
}

export interface Occurrence {
  debut: Date;
  fin: Date;
}

export function creerOccurrence(
  date: Date,
  heureDebut: string,
  heureFin: string,
): Occurrence {
  const debut = new Date(date);
  const fin = new Date(date);

  const [hd, md] = heureDebut.split(":").map(Number);
  const [hf, mf] = heureFin.split(":").map(Number);

  debut.setHours(hd, md, 0, 0);
  fin.setHours(hf, mf, 0, 0);

  return { debut, fin };
}

export function chevauche(occurrence1: Occurrence, occurrence2: Occurrence) {
  return (
    occurrence1.debut < occurrence2.fin && occurrence1.fin > occurrence2.debut
  );
}
