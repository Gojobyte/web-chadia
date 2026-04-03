import Link from "next/link";

interface DomainCardProps {
  id: string;
  titre: string;
  icone: string;
  description: string;
  variant?: "full" | "compact";
  enSavoirPlus?: string;
}

export default function DomainCard({
  id,
  titre,
  icone,
  description,
  variant = "full",
  enSavoirPlus,
}: DomainCardProps) {
  if (variant === "compact") {
    return (
      <a
        href={`#domaine-${id}`}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-sm whitespace-nowrap"
      >
        <span className="text-xl">{icone}</span>
        <span className="font-medium text-gray-800">{titre}</span>
      </a>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <span className="text-4xl mb-4">{icone}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{titre}</h3>
      <p className="text-sm text-gray-600 flex-1">{description}</p>
      <Link
        href={`/domaines#domaine-${id}`}
        className="mt-4 text-sm font-medium text-orange-700 hover:text-orange-800 transition-colors"
      >
        {enSavoirPlus || "En savoir plus"} →
      </Link>
    </div>
  );
}
