import type { MembreEquipe, Partenaire } from "@/lib/types";

interface EquipePartenairesProps {
  equipe: MembreEquipe[];
  partenaires: Partenaire[];
  labels: {
    equipe: string;
    partenaires: string;
  };
}

function AvatarInitiales({ nom }: { nom: string }) {
  const initiales = nom
    .replace(/\s*\[A VALIDER\]\s*/g, "?")
    .split(" ")
    .map((m) => m[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
      <span className="text-orange-700 font-bold text-xl">{initiales}</span>
    </div>
  );
}

export default function EquipePartenaires({
  equipe,
  partenaires,
  labels,
}: EquipePartenairesProps) {
  const membresConsentis = equipe.filter((m) => m.consent);
  const showEquipe = membresConsentis.length > 0;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Équipe — masquée si aucun consentement */}
        {showEquipe && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
              {labels.equipe}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {membresConsentis.map((membre, index) => (
                <div key={index} className="text-center">
                  <AvatarInitiales nom={membre.nom} />
                  <p className="font-semibold text-gray-900 text-sm">
                    {membre.nom.replace(/\s*\[A VALIDER\]\s*/g, "")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{membre.poste}</p>
                  {membre.institution && (
                    <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {membre.institution}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Partenaires */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            {labels.partenaires}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {partenaires.map((partenaire, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 px-4"
                title={partenaire.nom}
              >
                <span className="text-lg font-semibold text-gray-600">
                  {partenaire.nom}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
