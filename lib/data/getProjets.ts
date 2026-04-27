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
    return data.projets as Projet[];
  } catch {
    return projetsData as Projet[];
  }
}
