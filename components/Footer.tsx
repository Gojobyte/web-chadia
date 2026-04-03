import Link from "next/link";
import type { Contact } from "@/lib/types";

interface FooterProps {
  footer: {
    copyright: string;
    mentionsLegales: string;
    liensRapides: string;
    coordonnees: string;
  };
  nav: {
    accueil: string;
    aPropos: string;
    domaines: string;
    projets: string;
    contact: string;
  };
  contact: Contact;
}

export default function Footer({ footer, nav, contact }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 — Logo et description */}
          <div>
            <p className="font-bold text-xl text-white mb-3">ONG CHADIA</p>
            <p className="text-sm text-gray-400">
              Ensemble pour un Tchad plus résilient
            </p>
          </div>

          {/* Colonne 2 — Liens rapides */}
          <div>
            <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
              {footer.liensRapides}
            </p>
            <nav className="flex flex-col space-y-2" aria-label="Liens rapides">
              <Link href="/" className="text-sm hover:text-orange-400 transition-colors">{nav.accueil}</Link>
              <Link href="/a-propos" className="text-sm hover:text-orange-400 transition-colors">{nav.aPropos}</Link>
              <Link href="/domaines" className="text-sm hover:text-orange-400 transition-colors">{nav.domaines}</Link>
              <Link href="/projets" className="text-sm hover:text-orange-400 transition-colors">{nav.projets}</Link>
              <Link href="/contact" className="text-sm hover:text-orange-400 transition-colors">{nav.contact}</Link>
            </nav>
          </div>

          {/* Colonne 3 — Coordonnées */}
          <div>
            <p className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">
              {footer.coordonnees}
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              <p>{contact.adresse}</p>
              <p>{contact.telephone}</p>
              <a href={`mailto:${contact.email}`} className="hover:text-orange-400 transition-colors">
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            {footer.copyright.replace("{year}", String(year))}
          </p>
          <Link href="/mentions-legales" className="text-xs text-gray-500 hover:text-orange-400 transition-colors">
            {footer.mentionsLegales}
          </Link>
        </div>
      </div>
    </footer>
  );
}
