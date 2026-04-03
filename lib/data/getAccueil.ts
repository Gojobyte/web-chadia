import type { Accueil } from "@/lib/types";
import accueilData from "@/content/accueil.json";

export function getAccueil(): Accueil {
  return accueilData as Accueil;
}
