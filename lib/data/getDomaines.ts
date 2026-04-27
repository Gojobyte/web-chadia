import type { Domaine } from "@/lib/types";
import domainesData from "@/content/domaines.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getDomaines(): Promise<Domaine[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/domaines`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.domaines as Domaine[];
  } catch {
    return domainesData as Domaine[];
  }
}
