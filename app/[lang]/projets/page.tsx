import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getProjets } from "@/lib/data/getProjets";
import ProjectFilter from "@/components/ui/ProjectFilter";

export const metadata: Metadata = {
  title: "Projets & Réalisations",
  description:
    "Découvrez les projets de l'ONG CHADIA au Tchad : santé, éducation, autonomisation des femmes, eau et assainissement. Filtrez par domaine et statut.",
};

export default async function ProjetsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const projets = getProjets();
  const t = dict.projets;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        {t.titre}
      </h1>

      {/* Rendu statique de tous les projets pour SEO + dégradation sans JS */}
      <noscript>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projets.map((projet) => (
            <div key={projet.id} id={`proj-${projet.id}`} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{projet.titre}</h3>
              <p className="text-sm text-gray-600">{projet.description}</p>
            </div>
          ))}
        </div>
      </noscript>

      {/* Composant client avec filtres */}
      <ProjectFilter
          projets={projets}
          labels={{
            ...t.filtres,
            aucunResultat: t.aucunResultat,
            enCoursDocumentation: t.enCoursDocumentation,
          }}
        />
    </div>
  );
}
