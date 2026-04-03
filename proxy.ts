import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si le pathname contient déjà une locale supportée
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Pas de locale dans l'URL → rewrite interne vers /fr/ (la locale par défaut)
  // On utilise rewrite (pas redirect) pour garder l'URL propre sans /fr/
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    // Tout sauf _next, api, fichiers statiques
    "/((?!_next|api|images|documents|.*\\..*).*)",
  ],
};
