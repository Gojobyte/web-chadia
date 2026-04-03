import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

const dictionaries = { fr, en } as const;

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ["fr", "en"];
export const defaultLocale: Locale = "fr";

export function hasLocale(locale: string): locale is Locale {
  return locale in dictionaries;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
