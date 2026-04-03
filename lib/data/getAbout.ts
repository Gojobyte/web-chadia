import type { About } from "@/lib/types";
import aboutData from "@/content/about.json";

export function getAbout(): About {
  return aboutData as About;
}
