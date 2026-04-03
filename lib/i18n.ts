import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const dictionaries = { fr, en } as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: Locale = "fr") {
  return dictionaries[locale];
}
