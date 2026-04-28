import type { About } from "@/lib/types";
import aboutData from "@/content/about.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getAbout(): Promise<About> {
  try {
    const res = await fetch(`${API_URL}/api/public/about`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Transformer les donnees API vers le format attendu
    return {
      histoire: data.histoire ?? aboutData.histoire,
      vision: data.vision ?? aboutData.vision,
      mission: data.mission ?? aboutData.mission,
      // Nettoyer les valeurs (retirer id, ordre, infosONGId)
      valeurs: Array.isArray(data.valeurs)
        ? data.valeurs.map((v: Record<string, unknown>) => ({
            titre: v.titre,
            description: v.description,
          }))
        : aboutData.valeurs,
      statutLegal: data.statutLegal ?? aboutData.statutLegal,
      // L'API ne renvoie pas zonesIntervention, on utilise le fallback
      zonesIntervention: data.zonesIntervention ?? aboutData.zonesIntervention,
      equipe: data.equipe ?? aboutData.equipe,
    } as About;
  } catch {
    return aboutData as About;
  }
}
