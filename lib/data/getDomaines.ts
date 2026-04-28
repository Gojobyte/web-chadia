import type { Domaine } from "@/lib/types";
import domainesData from "@/content/domaines.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getDomaines(): Promise<Domaine[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/domaines`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Transformer les donnees API vers le format attendu par les composants
    return data.domaines.map((d: Record<string, unknown>) => ({
      ...d,
      // L'API renvoie activitesCles: [{ label }], le front attend: string[]
      activitesCles: Array.isArray(d.activitesCles)
        ? d.activitesCles.map((a: unknown) =>
            typeof a === "object" && a !== null ? (a as { label: string }).label : a
          )
        : d.activitesCles,
      // L'API renvoie zonesActives: [{ nom }], le front attend: string[]
      zonesActives: Array.isArray(d.zonesActives)
        ? d.zonesActives.map((z: unknown) =>
            typeof z === "object" && z !== null ? (z as { nom: string }).nom : z
          )
        : d.zonesActives,
      // L'API renvoie projets: [{ id, titre }], le front attend projetsAssocies
      projetsAssocies: Array.isArray(d.projets) ? d.projets : d.projetsAssocies ?? [],
    })) as Domaine[];
  } catch {
    return domainesData as Domaine[];
  }
}
