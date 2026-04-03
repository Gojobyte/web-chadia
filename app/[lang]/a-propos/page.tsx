import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/data/getAbout";

export const metadata: Metadata = {
  title: "À Propos | ONG CHADIA",
  description:
    "Découvrez l'histoire, la mission et les valeurs de l'ONG CHADIA. Organisation tchadienne engagée pour la santé, l'éducation et l'autonomisation des femmes.",
};

export default async function AProposPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const about = getAbout();
  const t = dict.about;
  const membresConsentis = about.equipe.filter((m) => m.consent);
  const showStatutLegal = about.statutLegal.numeroEnregistrement && about.statutLegal.autorite;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
        {t.titre}
      </h1>

      {/* Histoire */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-orange-700 mb-3">{t.sections.histoire}</h2>
        <p className="text-gray-700 leading-relaxed">{about.histoire.texte}</p>
      </section>

      {/* Vision */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-orange-700 mb-3">{t.sections.vision}</h2>
        <p className="text-gray-700 leading-relaxed italic">{about.vision}</p>
      </section>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-orange-700 mb-3">{t.sections.mission}</h2>
        <p className="text-gray-700 leading-relaxed">{about.mission}</p>
      </section>

      {/* Valeurs */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-orange-700 mb-4">{t.sections.valeurs}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {about.valeurs.map((valeur, i) => (
            <div key={i} className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{valeur.titre}</h3>
              <p className="text-sm text-gray-600">{valeur.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statut légal — conditionnel */}
      {showStatutLegal && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-orange-700 mb-3">{t.sections.statutLegal}</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
            <p>Numéro : {about.statutLegal.numeroEnregistrement}</p>
            <p>Date : {about.statutLegal.date}</p>
            <p>Autorité : {about.statutLegal.autorite}</p>
          </div>
        </section>
      )}

      {/* Zones d'intervention */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-orange-700 mb-3">{t.sections.zones}</h2>
        <div className="flex flex-wrap gap-2">
          {about.zonesIntervention.map((zone) => (
            <span key={zone} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {zone}
            </span>
          ))}
        </div>
      </section>

      {/* Équipe — masquée si aucun consentement */}
      {membresConsentis.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-orange-700 mb-4">{t.sections.equipe}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {membresConsentis.map((membre, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-700 font-bold text-xl">
                    {membre.nom.split(" ").map((m) => m[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="font-semibold text-sm text-gray-900">{membre.nom}</p>
                <p className="text-xs text-gray-500">{membre.poste}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
