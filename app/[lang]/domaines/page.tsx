import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getDomaines } from "@/lib/data/getDomaines";
import DomainCard from "@/components/ui/DomainCard";

export const metadata: Metadata = {
  title: "Domaines d'intervention | ONG CHADIA",
  description:
    "Découvrez les 5 domaines d'intervention de l'ONG CHADIA : santé communautaire, éducation, autonomisation des femmes, eau et assainissement, urgences humanitaires.",
};

export default async function DomainesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const domaines = getDomaines();
  const t = dict.domaines;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        {t.titre}
      </h1>

      {/* Barre de navigation rapide */}
      <nav className="flex gap-3 overflow-x-auto pb-4 mb-10" aria-label={t.navigationRapide}>
        {domaines.map((d) => (
          <DomainCard
            key={d.id}
            id={d.id}
            titre={d.titre}
            icone={d.icone}
            description={d.description}
            variant="compact"
          />
        ))}
      </nav>

      {/* Sections détaillées */}
      {domaines.map((domaine) => (
        <section
          key={domaine.id}
          id={`domaine-${domaine.id}`}
          className="mb-12 scroll-mt-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{domaine.icone}</span>
            <h2 className="text-2xl font-bold text-gray-900">{domaine.titre}</h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{domaine.descriptionLongue}</p>

          {/* Activités clés */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {t.activitesCles}
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {domaine.activitesCles.map((activite, i) => (
                <li key={i}>{activite}</li>
              ))}
            </ul>
          </div>

          {/* Indicateurs d'impact */}
          {domaine.indicateursImpact.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t.indicateurs}
              </h3>
              <div className="flex flex-wrap gap-3">
                {domaine.indicateursImpact.map((ind, i) => (
                  <span key={i} className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {ind.valeur} {ind.label.replace(/\s*\[A VALIDER\]\s*/g, "")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Zones actives */}
          {domaine.zonesActives.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t.zones}
              </h3>
              <div className="flex flex-wrap gap-2">
                {domaine.zonesActives.map((zone) => (
                  <span key={zone} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projets liés */}
          {domaine.projetsAssocies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t.projetsLies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {domaine.projetsAssocies.map((projet) => (
                  <Link
                    key={projet.id}
                    href={`/projets#proj-${projet.id}`}
                    className="text-sm text-orange-700 hover:text-orange-800 underline"
                  >
                    {projet.titre}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <hr className="mt-8 border-gray-200" />
        </section>
      ))}
    </div>
  );
}
