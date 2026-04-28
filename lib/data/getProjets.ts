import type { Projet } from "@/lib/types";
import projetsData from "@/content/projets.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getProjets(): Promise<Projet[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/projets`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Transformer les donnees API vers le format attendu par les composants
    // L'API renvoie domaine: { id, titre }, le front attend domaine: "sante"
    return data.projets.map((p: Record<string, unknown>) => ({
      ...p,
      domaine: typeof p.domaine === "object" && p.domaine !== null
        ? (p.domaine as { id: string }).id
        : p.domaine,
      zonesGeographiques: Array.isArray(p.zonesGeographiques)
        ? p.zonesGeographiques.map((z: unknown) =>
            typeof z === "object" && z !== null ? (z as { nom: string }).nom : z
          )
        : p.zonesGeographiques,
    })) as Projet[];
  } catch {
    return projetsData as Projet[];
  }
}
