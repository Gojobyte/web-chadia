"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface LangSwitcherProps {
  currentLang: Locale;
  labels: { fr: string; en: string };
}

export default function LangSwitcher({ currentLang, labels }: LangSwitcherProps) {
  const showSwitcher = process.env.NEXT_PUBLIC_SHOW_LANG_SWITCHER === "true";
  const pathname = usePathname();

  if (!showSwitcher) return null;

  // Calcul du chemin dans l'autre langue
  // Si on est en FR (pas de préfixe), on ajoute /en
  // Si on est en EN (/en/xxx), on retire le /en
  const switchPath =
    currentLang === "fr"
      ? `/en${pathname}`
      : pathname.replace(/^\/en/, "") || "/";

  return (
    <div className="flex items-center gap-1 text-sm">
      <Link
        href={currentLang === "fr" ? pathname : switchPath}
        className={`px-2 py-1 rounded ${
          currentLang === "fr"
            ? "bg-orange-700 text-white font-semibold"
            : "text-gray-600 hover:text-orange-700"
        }`}
        aria-label="Passer en français"
      >
        {labels.fr}
      </Link>
      <Link
        href={currentLang === "en" ? pathname : switchPath}
        className={`px-2 py-1 rounded ${
          currentLang === "en"
            ? "bg-orange-700 text-white font-semibold"
            : "text-gray-600 hover:text-orange-700"
        }`}
        aria-label="Switch to English"
      >
        {labels.en}
      </Link>
    </div>
  );
}
