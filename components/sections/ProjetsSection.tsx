import Link from "next/link";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Projet } from "@/lib/types";

interface ProjetsSectionProps {
  projets: Projet[];
  labels: {
    titre: string;
    voirTous: string;
  };
}

export default function ProjetsSection({ projets, labels }: ProjetsSectionProps) {
  const featured = projets.filter((p) => p.featured);

  return (
    <section id="projets" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          {labels.titre}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((projet) => (
            <ProjectCard
              key={projet.id}
              id={projet.id}
              titre={projet.titre}
              domaine={projet.domaine}
              description={projet.description}
              zonesGeographiques={projet.zonesGeographiques}
              responsable={projet.responsable}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/projets"
            className="inline-flex items-center px-6 py-3 border-2 border-orange-700 text-orange-700 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            {labels.voirTous} →
          </Link>
        </div>
      </div>
    </section>
  );
}
