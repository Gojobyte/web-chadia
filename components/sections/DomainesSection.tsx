import Link from "next/link";
import DomainCard from "@/components/ui/DomainCard";
import type { Domaine } from "@/lib/types";

interface DomainesSectionProps {
  domaines: Domaine[];
  labels: {
    titre: string;
    voirTous: string;
    enSavoirPlus: string;
  };
}

export default function DomainesSection({ domaines, labels }: DomainesSectionProps) {
  const featured = domaines.filter((d) => d.featured);

  return (
    <section id="domaines" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          {labels.titre}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((domaine) => (
            <DomainCard
              key={domaine.id}
              id={domaine.id}
              titre={domaine.titre}
              icone={domaine.icone}
              description={domaine.description}
              enSavoirPlus={labels.enSavoirPlus}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/domaines"
            className="inline-flex items-center px-6 py-3 border-2 border-orange-700 text-orange-700 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            {labels.voirTous} →
          </Link>
        </div>
      </div>
    </section>
  );
}
