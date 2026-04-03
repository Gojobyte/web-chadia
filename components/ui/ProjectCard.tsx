interface ProjectCardProps {
  id: string;
  titre: string;
  domaine: string;
  description: string;
  zonesGeographiques?: string[];
  responsable?: string;
}

export default function ProjectCard({
  id,
  titre,
  domaine,
  description,
  zonesGeographiques,
  responsable,
}: ProjectCardProps) {
  return (
    <div id={`proj-${id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded">
          {domaine}
        </span>
        {zonesGeographiques && zonesGeographiques.length > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {zonesGeographiques[0]}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{titre}</h3>
      <p className="text-sm text-gray-600 flex-1">{description}</p>

      {responsable && (
        <p className="mt-3 text-xs text-gray-400">
          Responsable : {responsable.replace(/\s*\[A VALIDER\]\s*/g, "")}
        </p>
      )}
    </div>
  );
}
