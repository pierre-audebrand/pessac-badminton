import { differenceInYears } from "date-fns";

export function calculerAge(dateNaissance: Date) {
  return differenceInYears(new Date(), dateNaissance);
}
