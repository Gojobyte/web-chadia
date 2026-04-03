import type { Domaine } from "@/lib/types";
import domainesData from "@/content/domaines.json";

export function getDomaines(): Domaine[] {
  return domainesData as Domaine[];
}
