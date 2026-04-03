"use client";

import { useState } from "react";
import Link from "next/link";
import LangSwitcher from "@/components/LangSwitcher";
import type { Locale } from "@/lib/i18n";

interface HeaderProps {
  nav: {
    accueil: string;
    aPropos: string;
    domaines: string;
    projets: string;
    contact: string;
    menuOuvrir: string;
    menuFermer: string;
  };
  lang?: Locale;
  langLabels?: { fr: string; en: string };
}

const navLinks = [
  { href: "/", label: "accueil" as const },
  { href: "/a-propos", label: "aPropos" as const },
  { href: "/domaines", label: "domaines" as const },
  { href: "/projets", label: "projets" as const },
  { href: "/contact", label: "contact" as const },
];

export default function Header({ nav, lang = "fr", langLabels }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-orange-700">
            ONG CHADIA
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-6" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-orange-700 transition-colors text-sm font-medium"
              >
                {nav[link.label]}
              </Link>
            ))}
          </nav>

          {/* Sélecteur de langue */}
          {langLabels && (
            <LangSwitcher currentLang={lang} labels={langLabels} />
          )}

          {/* Bouton hamburger mobile */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.menuFermer : nav.menuOuvrir}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <nav className="md:hidden pb-4" aria-label="Navigation mobile">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-orange-700 px-2 py-2 text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {nav[link.label]}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
