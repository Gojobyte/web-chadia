"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Projet } from "@/lib/types";

interface ProjectFilterProps {
  projets: Projet[];
  labels: {
    tous: string;
    enCours: string;
    termine: string;
    aucunResultat: string;
    enCoursDocumentation: string;
  };
}

export default function ProjectFilter({ projets, labels }: ProjectFilterProps) {
  const [filtreDomaine, setFiltreDomaine] = useState<string>("tous");
  const [filtreStatut, setFiltreStatut] = useState<string>("en cours");

  if (projets.length < 3) {
    return (
      <p className="text-center text-gray-500 py-8">{labels.enCoursDocumentation}</p>
    );
  }

  // Domaines uniques depuis les projets
  const domainesUniques = Array.from(new Set(projets.map((p) => p.domaine)));

  // Filtrage combiné (AND)
  const projetsFiltres = projets.filter((p) => {
    const matchDomaine = filtreDomaine === "tous" || p.domaine === filtreDomaine;
    const matchStatut = filtreStatut === "tous" || p.statut === filtreStatut;
    return matchDomaine && matchStatut;
  });

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Filtre par statut */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "en cours", label: labels.enCours },
            { value: "terminé", label: labels.termine },
            { value: "tous", label: labels.tous },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFiltreStatut(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filtreStatut === option.value
                  ? "bg-orange-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Filtre par domaine */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFiltreDomaine("tous")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filtreDomaine === "tous"
                ? "bg-orange-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {labels.tous}
          </button>
          {domainesUniques.map((domaine) => (
            <button
              key={domaine}
              onClick={() => setFiltreDomaine(domaine)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                filtreDomaine === domaine
                  ? "bg-orange-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {domaine}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      {projetsFiltres.length === 0 ? (
        <p className="text-center text-gray-500 py-8">{labels.aucunResultat}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetsFiltres.map((projet) => (
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
      )}
    </>
  );
}
