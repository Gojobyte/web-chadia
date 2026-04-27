import type { About } from "@/lib/types";
import aboutData from "@/content/about.json";

const API_URL = process.env.BACKEND_URL ?? "https://web-chadia-backend-production.up.railway.app";

export async function getAbout(): Promise<About> {
  try {
    const res = await fetch(`${API_URL}/api/public/about`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data as About;
  } catch {
    return aboutData as About;
  }
}
