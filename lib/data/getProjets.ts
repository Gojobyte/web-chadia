import type { Projet } from "@/lib/types";
import projetsData from "@/content/projets.json";

export function getProjets(): Projet[] {
  return projetsData as Projet[];
}
