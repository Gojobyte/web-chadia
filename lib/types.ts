// ONG CHADIA — Types TypeScript globaux
// Convention : PascalCase pour les types, camelCase pour les fonctions
// IMPORTANT : Vérifier l'absence de type similaire avant d'en créer un nouveau

// ---- Accueil (homepage) ----

export interface ChiffreCle {
  valeur: string;
  unite?: string;
  label: string;
}

export interface PrecomBadge {
  visible: boolean;
  texte: string;
}

export interface MembreEquipe {
  nom: string;
  poste: string;
  photo?: string;
  institution?: string;
  consent: boolean;
  consentDate?: string;
}

export interface Partenaire {
  nom: string;
  logo: string;
  url?: string;
}

export interface Accueil {
  hero: {
    titre: string;
    tagline: string;
    precomBadge: PrecomBadge;
    metaDescription: string;
  };
  chiffres: ChiffreCle[];
  equipe: MembreEquipe[];
  partenaires: Partenaire[];
  ctaBeneficiaires: {
    whatsappMessage: string;
  };
}

// ---- Domaines d'intervention ----

export interface IndicateurImpact {
  valeur: string;
  label: string;
}

export interface ProjetAssocie {
  id: string;
  titre: string;
}

export interface Domaine {
  id: string;
  titre: string;
  icone: string;
  description: string;
  descriptionLongue: string;
  activitesCles: string[];
  indicateursImpact: IndicateurImpact[];
  zonesActives: string[];
  projetsAssocies: ProjetAssocie[];
  featured: boolean;
}

// ---- Projets ----

export interface Projet {
  id: string;
  titre: string;
  domaine: string;
  statut: "en cours" | "terminé";
  zonesGeographiques: string[];
  dateDebut: string;
  dateFin?: string;
  description: string;
  indicateursImpact: IndicateurImpact[];
  image?: string;
  featured: boolean;
  responsable?: string;
}

// ---- À Propos ----

export interface Valeur {
  titre: string;
  description: string;
}

export interface StatutLegal {
  numeroEnregistrement: string;
  date: string;
  autorite: string;
}

export interface About {
  histoire: {
    titre: string;
    texte: string;
  };
  vision: string;
  mission: string;
  valeurs: Valeur[];
  statutLegal: StatutLegal;
  zonesIntervention: string[];
  equipe: MembreEquipe[];
}

// ---- Contact ----

export interface Contact {
  email: string;
  telephone: string;
  adresse: string;
  horaires: string;
  whatsapp: string;
}
