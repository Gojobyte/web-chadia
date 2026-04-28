import type { Accueil } from "@/lib/types";
import accueilData from "@/content/accueil.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getAccueil(): Promise<Accueil> {
  try {
    const res = await fetch(`${API_URL}/api/public/accueil`, {
      next: { revalidate: 0 }, // Revalider le cache toutes les 60 secondes
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Transformer la reponse API en format attendu par les composants
    return {
      hero: data.hero ?? accueilData.hero,
      chiffres: data.chiffres ?? accueilData.chiffres,
      equipe: data.equipe ?? accueilData.equipe,
      partenaires: data.partenaires ?? accueilData.partenaires,
      ctaBeneficiaires: data.ctaBeneficiaires ?? accueilData.ctaBeneficiaires,
    } as Accueil;
  } catch {
    // Fallback sur les JSON locaux si l'API est indisponible
    return accueilData as Accueil;
  }
}
