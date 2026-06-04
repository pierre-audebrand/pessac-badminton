export function formaterTrancheAge(
  ageMin: number | null,
  ageMax: number | null,
) {
  if (ageMin == null && ageMax == null) {
    return "Sans limite d'âge";
  }

  if (ageMin != null && ageMax != null) {
    return `${ageMin} - ${ageMax} ans`;
  }

  if (ageMin != null) {
    return `${ageMin} ans et plus`;
  }

  return `${ageMax} ans et moins`;
}
