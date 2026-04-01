# ONG CHADIA — Product Requirements Document (PRD)

> Powered by BMAD Method · Version 1.0 · Projet : web-chadia

---

## Table des matières

1. [Objectifs et Contexte](#1-objectifs-et-contexte)
2. [Exigences Fonctionnelles et Non-Fonctionnelles](#2-exigences)
3. [Objectifs UI/UX](#3-objectifs-uiux)
4. [Hypothèses Techniques](#4-hypothèses-techniques)
5. [Liste des Epics](#5-liste-des-epics)
6. [Epic 1 — Infrastructure & Fondations](#6-epic-1--infrastructure--fondations)
7. [Epic 2 — Homepage](#7-epic-2--homepage)
8. [Epic 3 — Pages Intérieures](#8-epic-3--pages-intérieures)
9. [Epic 4 — Qualité, SEO & Mise en Production](#9-epic-4--qualité-seo--mise-en-production)
10. [Prochaines Étapes](#10-prochaines-étapes)

---

## 1. Objectifs et Contexte

### 1.1 Objectifs

- Offrir à l'ONG CHADIA une présence web institutionnelle crédible auprès des bailleurs de fonds, partenaires techniques et institutions internationales
- Permettre aux bénéficiaires directs (populations vulnérables au Tchad) d'accéder aux informations et contacts de l'ONG depuis un smartphone basique sur réseau 3G
- Livrer une V1 entièrement autonome (sans dépendance au backend) avec un contenu géré via des fichiers JSON modifiables sans compétences techniques
- Préparer une architecture extensible permettant la connexion progressive au backend `dev-organize` (Express.js + Prisma + PostgreSQL) en V2
- Être référençable internationalement sur Google en français et en anglais

### 1.2 Contexte

L'ONG CHADIA (organisation non-gouvernementale tchadienne) intervient dans plusieurs domaines : santé communautaire, éducation, autonomisation des femmes, eau et assainissement, et réponse aux urgences humanitaires. Elle opère principalement à N'Djaména et dans la région de Mongo.

À ce jour, l'ONG ne dispose d'aucune présence web. Ses communications institutionnelles se font par documents PDF, contacts directs et réseaux informels. Face à des opportunités de financement international croissantes (UE, PNUD, coopération française), la direction souhaite disposer d'un site vitrine professionnel qui renforce la crédibilité de l'organisation.

Un backend technique complet existe déjà dans le dossier `dev-organize` (Express.js, Prisma, PostgreSQL/Supabase, 27 modules API, frontend React 19). La stratégie est de construire le site web en V1 comme un projet indépendant, puis de le connecter progressivement au backend en V2 en remplaçant les appels JSON locaux par des appels API.

**Plan de versions :**
- **V1** : Site vitrine autonome, contenu JSON, FR + EN, déployé sur Vercel
- **V2** : Connexion backend pour gestion dynamique du contenu (personnel, projets, actualités)
- **V3** : Portail bénéficiaires (formulaires, suivi de dossiers)
- **V4** : Support arabe + RTL complet

### 1.3 Journal des modifications

| Date | Version | Description | Auteur |
|---|---|---|---|
| 2026-04-01 | 1.0 | Création initiale du PRD via session BMAD | Adoum + PM Agent |

---

## 2. Exigences

### 2.1 Exigences Fonctionnelles

- **FR1** : Le site affiche une homepage avec les sections : hero (titre + tagline + PRECOM badge + CTA), chiffres clés, domaines d'intervention, projets récents, CTA bénéficiaires (WhatsApp), équipe, partenaires, téléchargement brochure PDF.
- **FR2** : Le contenu de chaque section est géré via des fichiers JSON dans `/content/*.json` (`accueil.json`, `about.json`, `domaines.json`, `projets.json`, `contact.json`), modifiables sans compétences techniques.
- **FR3** : Les textes d'interface (navigation, boutons, labels, messages) sont gérés via `/locales/fr.json` et `/locales/en.json`. Aucun texte d'interface n'est en dur dans les composants.
- **FR4** : Des fonctions d'abstraction (`getAccueil()`, `getDomaines()`, `getProjets()`, `getAbout()`, `getContact()`) dans `/lib/data/` centralisent l'accès au contenu JSON. Ces fonctions seront remplacées par des appels API en V2 sans modifier les composants.
- **FR5** : Le composant `DomainCard` accepte 4 props (`id`, `titre`, `icone`, `description`) et une prop optionnelle `variant: "compact" | "full"` (défaut `"full"`). Il est utilisé sur la homepage (featured) et sur la page Domaines complète (compact).
- **FR6** : Le composant `ProjectCard` accepte 4 props (`id`, `titre`, `domaine`, `description`) + props optionnelles (`zoneGeographique`, `featured`, `responsable`). Il est utilisé sur la homepage (featured) et sur la page Projets complète.
- **FR7** : La homepage filtre les domaines et projets avec `featured: true` dans leur JSON respectif pour n'afficher qu'une sélection représentative.
- **FR8** : La page Projets permet de filtrer par domaine et par statut (`en cours` / `terminé`). Le filtre par défaut est "En cours". Les filtres sont combinables (logique AND).
- **FR9** : Le formulaire de contact envoie les messages via une Vercel Serverless Function (`app/api/contact/route.ts`) utilisant Resend. Le routing email dépend du sujet : "Partenariat" → `CONTACT_EMAIL_PARTENARIAT`, autres → `CONTACT_EMAIL_GENERAL`.
- **FR10** : Un champ honeypot (`name="fax"`, `autoComplete="off"`, `tabIndex={-1}`, `aria-hidden="true"`) est présent dans le formulaire de contact pour bloquer les bots.
- **FR11** : Les profils de l'équipe ne s'affichent que si `consent: true` et `consentDate` sont renseignés dans `about.json`. La section est masquée entièrement si aucun profil n'a le consentement.
- **FR12** : La section Statut Légal de la page À Propos est conditionnelle — masquée si `numeroEnregistrement` ou `autorite` sont vides dans `about.json`.
- **FR13** : Un guard CI vérifie l'absence de mots interdits (`[A VALIDER]`, `[PLACEHOLDER]`, `[A REMPLACER]`, `Lorem ipsum`) dans tous les fichiers committés avant merge sur `main`.
- **FR14** : Le sélecteur de langue est contrôlé par la variable d'environnement `NEXT_PUBLIC_SHOW_LANG_SWITCHER`. Quand `false`, le sélecteur est masqué mais les routes `/en/` restent accessibles directement.
- **FR15** : La page 404 (`app/not-found.tsx`) affiche le message en français sur les routes FR et en anglais sur les routes `/en/...`.

### 2.2 Exigences Non-Fonctionnelles

- **NFR1** : Performance — LCP (Largest Contentful Paint) ≤ 2.5s sur connexion 3G rapide simulée. Score Lighthouse Performance ≥ 85 mobile (cible), ≥ 70 (bloquant pour mise en production).
- **NFR2** : Performance — CLS (Cumulative Layout Shift) ≤ 0.05 sur la homepage. INP (Interaction to Next Paint) ≤ 200ms sur toutes les pages interactives.
- **NFR3** : Performance — Bundle JavaScript First Load ≤ 150KB gzippé (mesuré via `next build` output). Aucune librairie de formulaire externe (React Hook Form, Formik).
- **NFR4** : Performance — Toutes les images utilisent `next/image` avec `alt` non-vide, `width` et `height` explicites, et lazy loading sauf le hero (qui utilise `priority`). Photos d'équipe ≤ 200KB, dimensions max 300×300px.
- **NFR5** : Accessibilité — Score Lighthouse Accessibility ≥ 90 sur les 5 pages principales. Ratio de contraste texte/fond ≥ 4.5:1 (WCAG AA). Navigation clavier complète.
- **NFR6** : Accessibilité — Les messages de statut du formulaire Contact ont `aria-live="polite"`. Tous les liens ont un texte descriptif. Les liens icône-only ont un `aria-label`.
- **NFR7** : SEO — Score Lighthouse SEO ≥ 90 sur toutes les pages. Chaque page a un `<title>` unique et une `<meta description>` unique (120-160 caractères, rédigée par la direction ONG).
- **NFR8** : SEO — Open Graph complet (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`) sur toutes les pages. Image OG : 1200×630px, ≤ 150KB.
- **NFR9** : SEO — Sitemap XML auto-généré via `app/sitemap.ts`. `public/robots.txt` configuré. Soumission manuelle dans Google Search Console post-lancement.
- **NFR10** : SEO — Canonical tags cohérents : pages FR → canonical FR, pages EN → canonical EN. Jamais de canonical croisé.
- **NFR11** : Infrastructure — Hébergement sur Vercel avec déploiement automatique depuis `main`. Chaque PR génère un preview URL. HTTPS automatique via Let's Encrypt.
- **NFR12** : Sécurité — Toutes les clés API (`RESEND_API_KEY`, `CONTACT_EMAIL_PARTENARIAT`, `CONTACT_EMAIL_GENERAL`) sont des variables d'environnement Vercel uniquement. Aucune valeur sensible dans le code. Aucun `console.log(process.env)` complet.
- **NFR13** : Compatibilité — Site testé sur Samsung Internet (Android Studio emulateur API 30+ ou LambdaTest free tier) à 360px sans overflow horizontal.
- **NFR14** : Maintenabilité — Architecture data abstraction layer : toutes les fonctions `getData()` dans `/lib/data/`, tous les types TypeScript dans `lib/types.ts` (vérifier l'absence de doublon avant création).

---

## 3. Objectifs UI/UX

### 3.1 Vision UX Globale

Le site doit transmettre deux messages simultanément : **crédibilité institutionnelle** pour les bailleurs et partenaires, **accessibilité et chaleur humaine** pour les bénéficiaires. L'interface doit être perçue comme professionnelle sans être froide, engagée sans être informelle.

### 3.2 Paradigmes d'Interaction

- **Mobile-first** : chaque composant est conçu pour 360px en premier, adapté pour 768px et 1280px ensuite
- **Progressivité** : le site est utilisable sans JavaScript activé (SSG, filtres en dégradation gracieuse)
- **Action directe** : le bouton WhatsApp est toujours visible sur mobile, le formulaire de contact n'est jamais à plus de 2 clics

### 3.3 Écrans Principaux

- Homepage (hero + sections)
- Page À Propos
- Page Domaines d'Intervention
- Page Projets / Réalisations
- Page Contact
- Page Mentions Légales
- Page 404

### 3.4 Accessibilité

WCAG AA — Score Lighthouse Accessibility ≥ 90.

### 3.5 Identité Visuelle

Tons chauds et ancrés dans le contexte africain — orange, ocre, vert — sans être clinquant. Typographie lisible sur petit écran. Contraste élevé pour lisibilité en plein soleil (usage mobile extérieur fréquent au Tchad).

### 3.6 Plateformes Cibles

Web Responsive — 360px (mobile Samsung Galaxy A03), 768px (tablette), 1280px (desktop). Navigateurs cibles : Chrome, Firefox, Safari, Samsung Internet.

---

## 4. Hypothèses Techniques

### 4.1 Structure du Dépôt

Polyrepo — `web-chadia` est un dépôt indépendant de `dev-organize`. La connexion V2 se fera par appels API depuis `web-chadia` vers le backend `dev-organize` déployé séparément.

### 4.2 Architecture des Services

**SSG (Static Site Generation)** avec Next.js 15 App Router. Toutes les pages sont générées au build. Pas de SSR ni ISR en V1. Une seule Serverless Function pour le formulaire de contact (`app/api/contact/route.ts`).

### 4.3 Exigences de Tests

- Tests manuels sur navigateurs cibles (Chrome, Samsung Internet)
- Audit Lighthouse avant chaque mise en production
- Guard CI sur mots interdits (pas de tests unitaires automatisés en V1)
- Test d'envoi du formulaire Contact en production avant lancement officiel

### 4.4 Hypothèses Techniques Supplémentaires

- **Framework** : Next.js 15 avec TypeScript strict
- **Hébergement** : Vercel (gratuit pour projets open source / ONG)
- **Email** : Resend (3 000 emails/mois gratuits)
- **Images** : `next/image` — conversion WebP automatique, lazy loading, srcset
- **i18n** : Routing par préfixe URL (`/` pour FR, `/en/` pour EN), fichiers `/locales/fr.json` et `/locales/en.json`
- **Contenu** : Fichiers JSON dans `/content/` — modifiables sans code
- **Styles** : Tailwind CSS
- **Polices** : Google Fonts via `next/font` pour éviter les requêtes externes
- **Analytics** : Vercel Speed Insights (gratuit, sans cookie)
- **Domaine** : `ong-chadia.org` (à vérifier disponibilité avant Epic 1 — alternatives : `ong-chadia.com`, `ongchadia.org`)
- **Backend V1** : Aucune connexion au backend `dev-organize` — data abstraction layer prépare la migration V2

---

## 5. Liste des Epics

| Epic | Titre | Objectif |
|---|---|---|
| Epic 1 | Infrastructure & Fondations | Mettre en place Next.js 15, Vercel CI/CD, système de contenu JSON, i18n, layout global et guard PR |
| Epic 2 | Homepage | Construire toutes les sections de la page d'accueil avec composants réutilisables et contenu réel |
| Epic 3 | Pages Intérieures | Créer les pages À Propos, Domaines, Projets, Contact + Mentions Légales avec le data abstraction layer |
| Epic 4 | Qualité, SEO & Production | Auditer les performances, compléter le contenu EN, configurer le domaine et mettre en production |

**Séquençage global :** Epic 1 → Epic 2 → Epic 3 → Epic 4 (séquentiels, chaque epic dépend du précédent)

---

## 6. Epic 1 — Infrastructure & Fondations

**Objectif :** Établir les fondations techniques du projet — environnement de développement, déploiement continu, système de contenu, internationalisation et layout global. À la fin de l'Epic 1, une page canary est visible en production sur Vercel et toute l'infrastructure est en place pour les Epics suivants.

---

### Story 1.1 — Setup Next.js 15 + TypeScript + Git

**En tant que** développeur,
**je veux** initialiser le projet Next.js 15 avec TypeScript et Git,
**afin de** disposer d'une base de code versionnée et typée dès le départ.

**Critères d'acceptation :**

1. `npx create-next-app@latest web-chadia --typescript --tailwind --app --src-dir=false` exécuté avec succès
2. Le fichier `tsconfig.json` est configuré avec `strict: true`
3. Un dépôt Git est initialisé avec un commit initial `chore: init Next.js 15 + TypeScript`
4. Le fichier `.gitignore` inclut `node_modules/`, `.env.local`, `.env*.local`, `.next/`
5. `npm run dev` démarre le serveur local sans erreur sur `localhost:3000`
6. `npm run build` produit un build de production sans erreur ni warning TypeScript
7. Le fichier `README.md` contient le nom du projet et les commandes de base (`dev`, `build`, `start`)

---

### Story 1.2 — Déploiement Continu sur Vercel

**En tant que** développeur,
**je veux** connecter le dépôt Git à Vercel avec déploiement automatique,
**afin que** chaque push sur `main` déclenche un déploiement et chaque PR génère un preview URL.

**Critères d'acceptation :**

1. Le projet est créé dans Vercel Dashboard et connecté au dépôt Git
2. Chaque push sur la branche `main` déclenche un déploiement de production automatique
3. Chaque Pull Request génère une URL de preview unique (ex: `web-chadia-git-feature-xxx.vercel.app`)
4. Le build Vercel utilise `npm run build` et réussit sans erreur
5. Vercel Speed Insights est activé sur le projet (`@vercel/speed-insights` installé dans `app/layout.tsx`)
6. L'URL de déploiement Vercel est accessible et affiche la page Next.js par défaut

---

### Story 1.3 — Architecture Dossiers et Conventions

**En tant que** développeur,
**je veux** établir la structure de dossiers et les conventions du projet,
**afin que** tous les fichiers soient organisés de façon cohérente et prévisible.

**Critères d'acceptation :**

1. La structure de dossiers suivante est créée :
   ```
   web-chadia/
   ├── app/                    (routes Next.js App Router)
   │   ├── [lang]/             (routing i18n)
   │   └── api/contact/        (Serverless Function)
   ├── components/
   │   ├── ui/                 (composants génériques)
   │   └── sections/           (sections de pages)
   ├── content/                (fichiers JSON de contenu)
   ├── lib/
   │   ├── data/               (fonctions getData)
   │   └── types.ts            (types TypeScript globaux)
   ├── locales/                (traductions i18n)
   │   ├── fr.json
   │   └── en.json
   └── public/
       ├── images/
       └── documents/          (brochure PDF)
   ```
2. Un fichier `lib/types.ts` vide est créé avec un commentaire indiquant : "Vérifier l'absence de type similaire avant d'en créer un nouveau"
3. Les conventions de nommage sont documentées dans un commentaire dans `lib/types.ts` : PascalCase pour les types, camelCase pour les fonctions

---

### Story 1.4 — Système de Contenu JSON

**En tant que** responsable de l'ONG,
**je veux** que le contenu du site soit géré via des fichiers JSON simples,
**afin de** pouvoir mettre à jour les informations sans modifier le code.

**Critères d'acceptation :**

1. Les fichiers JSON de contenu initiaux sont créés avec des données placeholder marquées `[A VALIDER]` :
   - `content/accueil.json` (hero, chiffres, equipe, partenaires)
   - `content/domaines.json` (liste des domaines avec `featured: boolean`, `zonesActives: string[]`)
   - `content/projets.json` (liste des projets avec `featured: boolean`, `statut`, `zonesGeographiques: string[]`, `responsable?: string`)
   - `content/contact.json` (email, telephone, adresse, whatsapp, horaires, emailPartenariat)
2. Les fonctions d'abstraction sont créées dans `lib/data/` :
   - `getAccueil.ts` → `getAccueil()`
   - `getDomaines.ts` → `getDomaines()`
   - `getProjets.ts` → `getProjets()`
   - `getContact.ts` → `getContact()`
3. Chaque fonction importe le JSON correspondant et retourne le contenu typé
4. Les types TypeScript (`Domaine`, `Projet`, `Contact`, `Accueil`) sont définis dans `lib/types.ts`
5. Un test manuel confirme que `getDomaines()` retourne un tableau non-vide

---

### Story 1.5 — Layout Global (Header + Footer)

**En tant que** visiteur,
**je veux** naviguer dans le site avec un header et un footer cohérents sur toutes les pages,
**afin de** trouver facilement les sections principales sans me perdre.

**Critères d'acceptation :**

1. Le composant `Header` est créé avec : logo ONG CHADIA, liens de navigation (Accueil, À Propos, Domaines, Projets, Contact), menu hamburger sur mobile
2. Le composant `Footer` est créé avec : nom ONG, liens rapides, coordonnées depuis `contact.json`, lien Mentions Légales
3. Le layout global `app/layout.tsx` intègre Header et Footer sur toutes les pages
4. La navigation est accessible au clavier (Tab + Enter)
5. Sur mobile 360px, le menu hamburger s'ouvre et se ferme sans overflow
6. Les liens de navigation correspondent aux routes existantes (pas de liens cassés)
7. Tous les textes du header/footer viennent de `locales/fr.json` (aucun texte en dur)

---

### Story 1.6 — Internationalisation (i18n) + Sélecteur de Langue

**En tant que** visiteur anglophone,
**je veux** basculer l'interface en anglais,
**afin de** comprendre la navigation et les formulaires dans ma langue.

**Critères d'acceptation :**

1. Le routing i18n est configuré avec le préfixe `/en/` pour l'anglais (ex: `/en/about`)
2. Le fichier `locales/fr.json` contient toutes les clés d'interface avec les valeurs en français
3. Le fichier `locales/en.json` contient les mêmes clés avec des valeurs placeholder `[A TRADUIRE]` (complétées en Story 4.3)
4. Le sélecteur de langue est ajouté dans le Header, affiché uniquement si `NEXT_PUBLIC_SHOW_LANG_SWITCHER=true`
5. La variable `NEXT_PUBLIC_SHOW_LANG_SWITCHER` est configurée à `false` par défaut dans `.env.local`
6. La langue active est visuellement distinguée dans le sélecteur (FR ou EN surligné)
7. Un middleware `middleware.ts` est créé pour gérer le routing par langue

---

### Story 1.7 — Guard PR (Vérification Mots Interdits)

**En tant que** développeur,
**je veux** un guard automatique qui bloque les merges avec du contenu placeholder,
**afin d'** éviter de déployer en production des données non validées.

**Critères d'acceptation :**

1. Un script de vérification est créé (`.github/workflows/guard-pr.yml` ou script npm)
2. Le guard recherche dans tous les fichiers committés les chaînes : `[A VALIDER]`, `[PLACEHOLDER]`, `[A REMPLACER]`, `[A TRADUIRE]`, `Lorem ipsum`
3. Si une occurrence est trouvée, le check échoue avec un message indiquant le fichier et la ligne
4. Le guard s'exécute sur chaque Pull Request ciblant `main`
5. Le guard ne s'exécute pas sur les branches de développement (seulement avant merge)
6. Un README de développement explique comment bypasser temporairement le guard si nécessaire (cas exceptionnel documenté)

---

## 7. Epic 2 — Homepage

**Objectif :** Construire l'intégralité de la page d'accueil avec du contenu réel (ou des placeholders structurés), en réutilisant les fondations de l'Epic 1. À la fin de l'Epic 2, la homepage est déployée sur Vercel et représente fidèlement l'identité de l'ONG CHADIA.

---

### Story 2.1 — Hero + Badge PRECOM + Navigation Ancre

**En tant que** visiteur arrivant sur le site,
**je veux** voir immédiatement qui est l'ONG CHADIA et ce qu'elle accomplit,
**afin de** décider en moins de 5 secondes si le site est pertinent pour moi.

**Critères d'acceptation :**

1. La section hero affiche : logo, titre principal (`accueil.hero.titre` en locales), tagline (`accueil.hero.tagline`), badge PRECOM (Programme Régional de Cohésion Sociale) sous la tagline, deux boutons CTA ("Découvrir nos projets" → `#projets`, "Nous contacter" → `/contact`)
2. Le badge PRECOM est chargé depuis `accueil.json` (champ `precomBadge: { visible: boolean, texte: string }`) — masqué si `visible: false`
3. Le fond du hero est un background coloré (ton dominant de la charte ONG) avec le logo centré — pas d'image Unsplash ou de stock photo
4. L'image hero (logo) utilise `next/image` avec `priority={true}` (chargement immédiat, pas de lazy loading)
5. Les deux boutons CTA sont visibles sur mobile 360px sans scroll
6. Le titre `<h1>` contient les mots-clés "ONG CHADIA" et "Tchad"
7. La balise `<title>` de la page est `ONG CHADIA | Ensemble pour le Tchad`
8. La meta description est renseignée dans `accueil.json` (rédigée par la direction ONG)

---

### Story 2.2 — Section Chiffres Clés

**En tant que** bailleur de fonds visitant la homepage,
**je veux** voir les indicateurs d'impact de l'ONG en un coup d'œil,
**afin d'** évaluer l'échelle et la pertinence de l'organisation.

**Critères d'acceptation :**

1. La section affiche 4-6 chiffres clés depuis `accueil.json` (champ `chiffres: [{ valeur, unite, label }]`)
2. Les valeurs non encore validées portent le suffixe `[A VALIDER]` dans `accueil.json` — ce marqueur est visible uniquement dans le JSON source, jamais affiché en production (bloqué par le guard PR de Story 1.7)
3. Le chiffre principal est `568M+ FCFA` (budget total géré) — marqué `[A VALIDER]` jusqu'à confirmation par la direction
4. Chaque chiffre a une valeur, une unité optionnelle, et un label descriptif
5. Sur mobile 360px, les chiffres s'affichent en grille 2×2 ou 2×3 lisible
6. La section a l'attribut `id="chiffres"` pour le scroll depuis le hero

---

### Story 2.3 — Section Domaines d'Intervention (Homepage)

**En tant que** visiteur voulant comprendre les activités de l'ONG,
**je veux** voir les principaux domaines d'intervention sur la homepage,
**afin de** trouver rapidement si l'ONG est active dans mon domaine d'intérêt.

**Critères d'acceptation :**

1. La section affiche uniquement les domaines avec `featured: true` dans `domaines.json`
2. Chaque domaine utilise le composant `DomainCard` avec les props : `id`, `titre`, `icone`, `description`
3. Le composant `DomainCard` accepte une prop optionnelle `variant: "compact" | "full"` (défaut `"full"`)
4. En variant `"full"` (homepage) : icône + titre + description courte + lien "En savoir plus" → `/domaines#domaine-{id}`
5. Un lien "Voir tous nos domaines" → `/domaines` est affiché en bas de la section
6. La section a l'attribut `id="domaines"` pour le scroll depuis la navigation
7. Sur mobile 360px, les cards s'affichent en colonne unique
8. Tous les textes d'interface viennent de `locales/fr.json`

---

### Story 2.4 — Section Projets Récents (Homepage)

**En tant que** visiteur cherchant des preuves d'impact,
**je veux** voir les projets phares de l'ONG sur la homepage,
**afin d'** avoir une preuve concrète de l'activité de l'organisation.

**Critères d'acceptation :**

1. La section affiche uniquement les projets avec `featured: true` dans `projets.json`
2. Chaque projet utilise le composant `ProjectCard` avec les props : `id`, `titre`, `domaine`, `description`, `zonesGeographiques`, `responsable?`
3. Les projets PRECOM sont affichés en premier (ordre défini dans le JSON)
4. Un badge zone géographique (ex: "N'Djaména", "Mongo") est visible sur chaque card depuis `zonesGeographiques[0]`
5. Si `responsable` est renseigné, il est affiché discrètement sur la card
6. Un lien "Voir tous nos projets" → `/projets` est affiché en bas de la section
7. La section a l'attribut `id="projets"` pour le scroll depuis la navigation
8. Sur mobile 360px, les cards s'affichent en colonne unique sans overflow

---

### Story 2.5 — Section CTA Bénéficiaires (WhatsApp)

**En tant que** bénéficiaire direct (victime de VBG, demandeur d'emploi, personne vulnérable),
**je veux** pouvoir contacter l'ONG immédiatement sans remplir de formulaire,
**afin d'** obtenir de l'aide rapidement depuis mon téléphone.

**Critères d'acceptation :**

1. La section affiche un bloc CTA distinct avec un fond coloré contrasté (visuellement séparé du reste de la page)
2. Le bouton WhatsApp utilise le lien `https://wa.me/{whatsapp}?text=...` avec le numéro depuis `contact.json`
3. Le message WhatsApp pré-rempli est simple et inclusif : "Bonjour ONG CHADIA, j'ai besoin d'information."
4. Le bouton est visible immédiatement sur mobile 360px sans scroll dans la section
5. La section est toujours affichée sur mobile (pas de masquage sur petits écrans)
6. Le texte de la section (`accueil.ctaBeneficiaires.*` en locales) explique brièvement comment l'ONG peut aider
7. Le bouton a un `aria-label` descriptif pour les lecteurs d'écran

---

### Story 2.6 — Section Équipe et Partenaires

**En tant que** bailleur ou partenaire potentiel,
**je veux** voir qui dirige l'ONG et avec quels partenaires elle travaille,
**afin d'** évaluer le sérieux et le réseau de l'organisation.

**Critères d'acceptation :**

1. La section Équipe affiche uniquement les membres avec `consent: true` dans `accueil.json`
2. Si aucun membre n'a le consentement, la section Équipe est masquée entièrement (pas de titre orphelin)
3. Chaque membre affiche : photo (`next/image`, WebP, lazy loading, alt = nom), nom, poste, badge institution si renseigné
4. Si la photo est absente ou null, un avatar SVG placeholder avec les initiales s'affiche
5. La section Partenaires affiche les logos des partenaires depuis `accueil.json` (champ `partenaires`)
6. PNUD est listé en premier dans les partenaires
7. Les logos partenaires sont affichés en couleur directement (pas de filtre gris — adaptation mobile sans hover)
8. Sur mobile 360px, les logos sont scrollables horizontalement ou affichés en grille compacte

---

### Story 2.7 — Brochure PDF + Validation Finale Homepage

**En tant que** visiteur souhaitant partager les informations sur l'ONG,
**je veux** télécharger une brochure institutionnelle au format PDF,
**afin de** disposer d'un document à envoyer à des collègues ou partenaires.

**Critères d'acceptation :**

1. Un bloc de téléchargement est affiché sur la homepage avec un bouton "Télécharger notre brochure (PDF)"
2. Le lien pointe vers `/documents/brochure-chadia.pdf` dans le dossier `public/documents/`
3. Le fichier PDF placeholder est présent dans le dépôt (même vide, pour éviter les erreurs 404)
4. Le bouton a l'attribut `download` et un `aria-label` descriptif
5. Le guard PR passe sans erreur sur la branche homepage (`npm run guard` ou équivalent CI)
6. La homepage est testée manuellement sur Samsung Internet (Android Studio emulateur ou LambdaTest) à 360px :
   - Pas d'overflow horizontal sur aucune section
   - Tous les boutons sont cliquables sans zoom
   - Les images se chargent correctement

---

## 8. Epic 3 — Pages Intérieures

**Objectif :** Délivrer les 4 pages intérieures qui transforment le site vitrine en ressource institutionnelle complète. Chaque page réutilise les composants Epic 2 (DomainCard, ProjectCard), enrichit le SEO on-page, et permet aux visiteurs d'approfondir leur compréhension de l'ONG avant de passer à l'action.

**Séquençage :** `3.1 → 3.2 → 3.3 → 3.4` (séquentiel)

---

### Story 3.1 — Page "À Propos" + Page 404

**En tant que** visiteur institutionnel (bailleur, partenaire potentiel),
**je veux** accéder à une page dédiée à l'identité de l'ONG CHADIA,
**afin de** évaluer la légitimité et la crédibilité de l'organisation avant tout engagement.

**Critères d'acceptation :**

1. La route `/a-propos` (FR) et `/en/about` (EN) retourne la page sans erreur 404
2. Le contenu est chargé depuis `content/about.json` via `getAbout()` dans `lib/data/getAbout.ts`
3. La fonction `getAbout()` suit le même pattern que `getAccueil()`, `getDomaines()`, etc. Le type `About` est défini dans `lib/types.ts` (vérifier l'absence de doublon avant création)
4. La structure de `about.json` :
   ```json
   {
     "histoire": { "titre": "...", "texte": "..." },
     "vision": "...",
     "mission": "...",
     "valeurs": [{ "titre": "...", "description": "..." }],
     "statutLegal": { "numeroEnregistrement": "...", "date": "...", "autorite": "..." },
     "zonesIntervention": ["N'Djaména", "Mongo"],
     "equipe": [
       { "nom": "...", "poste": "...", "photo": "...", "consent": true, "consentDate": "2025-01-15" }
     ]
   }
   ```
5. La section Statut Légal est conditionnelle — masquée si `numeroEnregistrement` ou `autorite` sont vides (aucun marqueur `[A VALIDER]` affiché en production)
6. La section Équipe n'affiche que les profils avec `consent: true` — si aucun, le bloc est masqué entièrement
7. Les photos d'équipe : `next/image`, WebP, `sizes="(max-width: 768px) 80px, 120px"`, lazy loading, alt = nom du membre. Si photo absente : avatar SVG initiales. Poids max : 200KB, dimensions max 300×300px
8. Le titre `<h1>` correspond à `about.titre` dans `locales/fr.json`
9. La balise `<title>` : `À Propos | ONG CHADIA`. Meta description depuis `about.json`
10. Lighthouse Accessibility ≥ 90
11. Tous les textes d'interface viennent de `locales/fr.json`
12. **Page 404** : Le fichier `app/not-found.tsx` est créé, retourne HTTP 404, affiche `errors.404.titre` + `errors.404.message` + bouton "Retour à l'accueil". Sur routes `/en/...`, le message est en anglais. Layout global présent (header/footer)

---

### Story 3.2 — Page "Domaines d'Intervention" (Complète)

**En tant que** bailleur de fonds ou partenaire technique,
**je veux** voir l'ensemble des domaines d'intervention avec leur détail,
**afin de** identifier les thématiques alignées avec mon mandat avant de contacter l'ONG.

**Critères d'acceptation :**

1. La route `/domaines` (FR) et `/en/areas` (EN) retourne la page
2. **Modification rétrocompatible de DomainCard** : ajout de la prop optionnelle `variant: "compact" | "full"` (défaut `"full"`) dans le composant créé en Story 2.3. Cette modification ne change pas le comportement des usages homepage (Epic 2)
3. Tous les domaines de `domaines.json` sont affichés (pas de filtre `featured` sur cette page)
4. En haut de page, une barre de navigation rapide liste tous les domaines — clic = scroll vers `#domaine-{id}`
5. Chaque domaine utilise `DomainCard` avec `variant="compact"` (icône + titre uniquement)
6. Sous chaque DomainCard, une section détaillée affiche : `descriptionLongue`, liste `activitesCles`, badges `indicateursImpact`, badges `zonesActives`, liens vers projets associés
7. Les `projetsAssocies` sont dénormalisés dans `domaines.json` :
   ```json
   "projetsAssocies": [{ "id": "proj-001", "titre": "Accès à l'eau — Mongo" }]
   ```
   Affichés comme liens texte vers `/projets#proj-{id}`. Si tableau vide, bloc masqué
8. La page est entièrement SSG (pas de fetch client)
9. La balise `<title>` et meta description renseignées
10. Sur mobile 360px, barre navigation scrollable horizontalement, sections en colonne pleine largeur
11. Si des tests de snapshot existent pour `DomainCard`, les mettre à jour lors de la modification

---

### Story 3.3 — Page "Projets / Réalisations" (Complète + Filtres)

**En tant que** visiteur voulant voir les réalisations concrètes de l'ONG,
**je veux** parcourir tous les projets avec la possibilité de filtrer par domaine ou statut,
**afin de** trouver rapidement les projets pertinents à mon domaine d'intérêt.

**Critères d'acceptation :**

1. La route `/projets` (FR) et `/en/projects` (EN) retourne la page
2. La structure JSON de chaque projet inclut : `id`, `titre`, `domaine`, `statut` (`"en cours"` / `"terminé"`), `zonesGeographiques: string[]`, `dateDebut`, `dateFin?`, `description`, `indicateursImpact`, `image?`, `featured`, `responsable?`
3. Tous les projets de `projets.json` sont affichés par défaut
4. Le filtre par défaut est **"En cours"** (pas "Tous") — montre l'activité immédiatement
5. Deux rangées de filtres : **Domaine** (valeurs dynamiques depuis JSON) + **Statut** ("En cours" / "Terminé" / "Tous")
6. Les filtres sont combinables (logique AND). Si aucun résultat : message "Aucun projet pour ces critères"
7. Si `projets.json` contient plus de 20 projets, les projets `statut: "terminé"` sont repliés par défaut derrière un bouton "Voir les projets terminés"
8. Si `projets.json` contient moins de 3 projets : message "Projets en cours de documentation" affiché
9. **Structure fichiers** :
   ```
   app/projets/page.tsx          ← Server Component (pas de "use client")
   components/ui/ProjectFilter.tsx ← "use client" en ligne 1
   ```
   `page.tsx` passe `projets={allProjets}` en prop à `ProjectFilter`
10. Sans JavaScript activé, tous les projets s'affichent et les filtres sont masqués (dégradation gracieuse)
11. Chaque projet est accessible par ancre URL : `/projets#proj-{id}` (attribut `id="proj-{id}"` sur chaque card)
12. La balise `<title>` et meta description renseignées
13. Sur mobile 360px, filtres scrollables horizontalement
14. **Avant de merger cette story** : tester localement le formulaire Contact avec les variables d'environnement configurées. Confirmer que le routing email fonctionne selon le sujet

---

### Story 3.4 — Page "Contact" + Formulaire + Mentions Légales

**En tant que** visiteur souhaitant contacter l'ONG,
**je veux** accéder à un formulaire simple et à des informations de contact directes,
**afin de** envoyer ma demande sans friction quelle que soit ma situation.

**Critères d'acceptation :**

1. La route `/contact` retourne la page (même slug FR et EN)
2. La structure de `content/contact.json` :
   ```json
   {
     "email": "contact@ong-chadia.org",
     "emailPartenariat": "partenariats@ong-chadia.org",
     "telephone": "+235 XX XX XX XX",
     "adresse": "N'Djaména, Tchad",
     "horaires": "Lun–Ven, 8h–17h",
     "whatsapp": "+235XXXXXXXX"
   }
   ```
3. **WhatsApp affiché EN PREMIER** sur la page, avant le formulaire, avec libellé "Contactez-nous sur WhatsApp — réponse rapide"
4. Le formulaire contient : Nom (required), Email (required), Sujet (select), Message (textarea, required), case Consentement RGPD (required avec lien vers `/mentions-legales#confidentialite`)
5. Options du Sujet : "Partenariat / Don / Bénévolat / Demande d'aide ou information / Autre"
6. Champ honeypot : `name="fax"`, `autoComplete="off"`, `tabIndex={-1}`, `aria-hidden="true"`, invisible via CSS
7. **Serverless Function** `app/api/contact/route.ts` :
   - Vérifie que honeypot est vide → si rempli : HTTP 200 silencieux
   - Vérifie que `RESEND_API_KEY` est défini → si absent : log `console.error('RESEND_API_KEY manquante')` + HTTP 503
   - Valide tous les champs requis côté serveur
   - **Routing email** : `sujet === 'Partenariat'` → envoie à `process.env.CONTACT_EMAIL_PARTENARIAT` ; sinon → `process.env.CONTACT_EMAIL_GENERAL`
   - Aucun `console.log(process.env)` complet. Logs sans valeurs de variables
8. En cas de succès HTTP 200 : formulaire remplacé par message de confirmation (`contact.succes` en locales), pas de rechargement
9. En cas d'erreur HTTP 5xx : message non technique (`contact.erreur`) + formulaire reste rempli
10. Bouton d'envoi `disabled` pendant la soumission
11. Validation HTML5 native (`required`, `type="email"`) — aucune librairie externe (React Hook Form, Formik)
12. Layout 2 colonnes desktop (infos contact + formulaire), 1 colonne mobile
13. Lighthouse Accessibility ≥ 90 (labels associés aux inputs, `aria-live="polite"` sur messages d'état)
14. **Page Mentions Légales** (dans la même story) :
    - Route `/mentions-legales` (FR) et `/en/legal` (EN)
    - Page statique TSX (pas de `getLegal()` ni `legal.json` — contenu en dur dans le fichier)
    - Sections : Mentions légales (dénomination, siège, directeur) + Politique de confidentialité (données collectées, finalité, durée, droits)
    - Textes marqués `[A VALIDER par direction]` dans le code source
    - `<meta name="robots" content="noindex, follow">`
    - Référencée dans le footer (lien discret)
    - Lien ancre `#confidentialite` fonctionnel depuis la case RGPD du formulaire

---

## 9. Epic 4 — Qualité, SEO & Mise en Production

**Objectif :** Transformer le site fonctionnel en produit production-ready — référençable sur Google, mesuré en performance, accessible en FR+EN, configuré sur le domaine définitif, et prêt à recevoir des visiteurs réels.

**Prérequis non technique :** Vérifier la disponibilité du domaine `ong-chadia.org` avant de commencer l'Epic 1 (pas seulement l'Epic 4). Alternatives : `ong-chadia.com`, `chadia-ong.org`, `ongchadia.org`. Fallback : `web-chadia.vercel.app` si le domaine n'est pas disponible au moment du lancement.

**Séquençage :** `4.1 → (4.2 ∥ 4.3) → 4.4` (4.2 et 4.3 sont parallélisables)

---

### Story 4.1 — SEO On-Page et Métadonnées Structurées

**En tant que** responsable de l'ONG,
**je veux** que le site soit correctement référencé sur les moteurs de recherche,
**afin que** les bailleurs et partenaires trouvent l'ONG CHADIA en cherchant sur Google.

**Prérequis :** Toutes les branches Epic 3 sont mergées avant de démarrer cette story. Vérifier que `app/layout.tsx` ne contient pas déjà un export `metadata` avant d'en ajouter un.

**Critères d'acceptation :**

1. Le fichier `app/layout.tsx` définit les métadonnées globales via l'API `metadata` de Next.js 15 (pas de balises `<head>` manuelles)
2. Chaque page exporte sa propre constante `metadata` ou fonction `generateMetadata()` surchargeant les valeurs globales
3. `<title>` unique par page au format `{Titre page} | ONG CHADIA`. Homepage : `ONG CHADIA | Ensemble pour le Tchad`
4. `<meta description>` unique par page, 120-160 caractères, rédigée par la direction ONG (mentionne : Tchad + domaines + bénéficiaires). Exemple homepage : *"ONG CHADIA agit au Tchad pour la santé communautaire, l'éducation et l'autonomisation des femmes. Découvrez nos projets et comment nous rejoindre."*
5. Open Graph complet sur toutes les pages : `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale` (`fr_FR` sur FR, `en_US` sur EN), `og:locale:alternate`
6. `public/og-image.jpg` : 1200×630px, logo ONG CHADIA + tagline, fond coloré, ≤ 150KB
7. Bloc JSON-LD `Organization` (type `NGO`) sur la homepage uniquement. Le champ `sameAs` est omis si aucun profil vérifié (réseaux sociaux). Validé via Google Rich Results Test avant déploiement
8. `app/sitemap.ts` génère le sitemap XML avec les valeurs suivantes :

   | Page | priority | changeFrequency |
   |---|---|---|
   | Homepage | 1.0 | weekly |
   | Domaines, Projets | 0.8 | monthly |
   | À propos, Contact | 0.7 | monthly |
   | Mentions légales | 0.3 | yearly |

9. `public/robots.txt` :
   ```
   User-agent: *
   Allow: /
   Disallow: /api/
   Sitemap: https://ong-chadia.org/sitemap.xml
   ```
10. Canonical tags cohérents : pages FR → canonical FR, pages EN → canonical EN. Jamais de canonical croisé
11. Pages `/mentions-legales` et `/en/legal` : `<meta name="robots" content="noindex, follow">`
12. Aucun lien interne cassé — `next build` se termine sans erreur

---

### Story 4.2 — Validation Performance et Accessibilité

**En tant que** bénéficiaire sur réseau 3G et bailleur sur desktop,
**je veux** que le site se charge rapidement et soit accessible à tous,
**afin d'** avoir une expérience fluide quelle que soit ma connexion ou mon équipement.

**Critères d'acceptation :**

1. **Avant soumission** : exécuter `next build && next start` localement + audit Lighthouse via Chrome DevTools sur la homepage. Si score < 85, identifier le composant responsable via "Opportunities" et corriger avant de passer en production
2. Lighthouse Performance ≥ 85 mobile (cible) / ≥ 70 (bloquant pour mise en production) — mesuré en émulation Moto G4, réseau 3G rapide
3. Lighthouse Performance ≥ 90 desktop
4. Lighthouse Accessibility ≥ 90 sur les 5 pages : homepage, À propos, Domaines, Projets, Contact
5. Lighthouse SEO ≥ 90 sur les 5 pages
6. LCP ≤ 2.5s sur homepage en simulation 3G rapide
7. CLS ≤ 0.05 sur la homepage. Toutes les images ont `width` et `height` explicites. Skeleton loaders sur sections chargées en dernier (équipe, partenaires)
8. INP ≤ 200ms sur toutes les pages interactives
9. Toutes les images ont `alt` non-vide et descriptif (pas `alt="image"`)
10. Tous les liens ont un texte visible — liens icône-only ont `aria-label`
11. Ratio contraste texte/fond ≥ 4.5:1 (courant), ≥ 3:1 (grands titres) — WCAG AA
12. Navigation clavier complète : Tab, Shift+Tab, Enter, aucun focus piégé
13. Messages de statut formulaire Contact : `aria-live="polite"`
14. Test Samsung Internet (Android Studio emulateur API 30+ ou LambdaTest free tier) à 360px :
    - Homepage : pas d'overflow horizontal
    - Contact 360px : formulaire complet sans scroll horizontal
    - Bouton WhatsApp visible et cliquable sans zoom
15. Bundle JS First Load ≤ 150KB gzippé (vérifié via `next build` output)
16. Vercel Speed Insights actif et affichant les premières métriques

---

### Story 4.3 — Intégration Contenu EN et Bascule Linguistique

**En tant que** bailleur ou partenaire international non-francophone,
**je veux** naviguer sur le site en anglais,
**afin de** comprendre les activités de l'ONG sans barrière linguistique.

**Note :** Cette story peut être livrée après le lancement officiel grâce au feature flag `NEXT_PUBLIC_SHOW_LANG_SWITCHER`. Elle est parallélisable avec Story 4.2.

**Critères d'acceptation :**

1. `locales/en.json` est complété pour les pages **Homepage et Contact** — traduction de qualité (humaine ou IA relue par un locuteur natif, pas de Google Translate brut)
2. Les autres pages (À Propos, Domaines, Projets) affichent un bandeau discret : `"This content is available in French only — English version coming soon"` plutôt qu'une traduction approximative
3. `NEXT_PUBLIC_SHOW_LANG_SWITCHER=true` est configuré dans Vercel pour activer le sélecteur
4. Le sélecteur bascule entre `/` (FR) et `/en/` (EN) via navigation Next.js client-side
5. Le middleware `middleware.ts` peut optionnellement détecter le header `Accept-Language` pour rediriger vers `/en/` — comportement optionnel en V1
6. Toutes les routes EN retournent HTTP 200 : `/en/`, `/en/about`, `/en/areas`, `/en/projects`, `/en/contact`, `/en/legal`
7. `<title>` et meta descriptions en anglais sur toutes les routes `/en/`
8. Textes d'interface en anglais sur `/en/` : navigation, boutons, labels formulaire, messages succès/erreur, options du `<select>` Contact : "Partnership / Donation / Volunteer / Request for assistance / Other"
9. Le feature flag masque uniquement le sélecteur — les routes `/en/` restent accessibles directement par URL (comportement intentionnel)
10. Page 404 sur routes `/en/...` : message en anglais
11. Le sélecteur indique visuellement la langue active

---

### Story 4.4 — Configuration Domaine et Mise en Production

**En tant que** visiteur cherchant l'ONG CHADIA,
**je veux** accéder au site via l'URL définitive `ong-chadia.org`,
**afin de** trouver le site facilement et lui faire confiance (HTTPS, URL propre).

**Prérequis :** Domaine `ong-chadia.org` acheté + accès panel registrar DNS disponible. Si domaine indisponible, le site est livré sur `web-chadia.vercel.app` en attendant.

**Critères d'acceptation :**

1. Le domaine est configuré dans Vercel Dashboard → Settings → Domains avec `ong-chadia.org`
2. `www.ong-chadia.org` ajouté avec redirection 301 vers `ong-chadia.org` (sans www)
3. Enregistrements DNS configurés chez le registrar — **utiliser l'IP affichée dans Vercel Dashboard** (ne pas copier une IP depuis la documentation externe) :
   - Enregistrement A : `@` → IP Vercel (depuis Dashboard)
   - Enregistrement CNAME : `www` → `cname.vercel-dns.com`
4. Certificat TLS Let's Encrypt actif (onglet "Valid Configuration" vert dans Vercel)
5. `http://ong-chadia.org` redirige vers `https://ong-chadia.org` avec HTTP 301 (testé via `curl -I http://ong-chadia.org`)
6. **DNS configuré au minimum 72h avant la date de lancement officiel** (propagation mondiale)
7. Variables d'environnement de production configurées dans Vercel → Settings → Environment Variables :
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL_PARTENARIAT`
   - `CONTACT_EMAIL_GENERAL`
   - `NEXT_PUBLIC_SHOW_LANG_SWITCHER`
8. **Checklist pré-lancement** (à cocher avant déploiement production) :
   - [ ] `RESEND_API_KEY` configurée et testée
   - [ ] Guard PR passé sans erreur (aucun mot interdit)
   - [ ] Lighthouse ≥ 70 mobile confirmé
   - [ ] JSON-LD validé via Google Rich Results Test
   - [ ] Test formulaire Contact réussi en preview Vercel
9. **Tests end-to-end post-déploiement** :
   - Homepage charge en < 3s sur connexion mobile simulée
   - Formulaire Contact → email reçu sur `CONTACT_EMAIL_GENERAL`
   - Formulaire avec sujet "Partenariat" → email reçu sur `CONTACT_EMAIL_PARTENARIAT`
   - Sélecteur FR↔EN fonctionnel (si `NEXT_PUBLIC_SHOW_LANG_SWITCHER=true`)
   - URL inexistante → page 404 avec statut HTTP 404
10. **Google Search Console** (après propagation DNS) :
    1. Créer un compte Google Search Console
    2. Ajouter la propriété `ong-chadia.org` et choisir la vérification DNS
    3. Copier l'enregistrement TXT de vérification
    4. Ajouter l'enregistrement TXT dans le registrar DNS
    5. Attendre la vérification Google (quelques minutes à quelques heures)
    6. Soumettre le sitemap `https://ong-chadia.org/sitemap.xml`
11. Vercel Speed Insights affiche les premières métriques dans le dashboard après 24h de trafic
12. Déploiement automatique depuis `main` actif — chaque push déclenche un déploiement production

---

## 10. Prochaines Étapes

### 10.1 Prompt UX Expert

Le PRD du site ONG CHADIA est finalisé. En tant qu'expert UX/Design, prends ce document comme input et crée les wireframes basse fidélité pour les 4 pages principales (Homepage, À Propos, Domaines, Contact). Concentre-toi sur la double audience (bailleurs institutionnels + bénéficiaires mobiles 3G), le mobile-first 360px, et la hiérarchie d'information. Identifie les zones de tension UX entre les deux audiences et propose des solutions de design.

### 10.2 Prompt Architecte

Le PRD du site ONG CHADIA est finalisé. En tant qu'architecte technique, prends ce document comme input et produis le document d'architecture technique pour le projet `web-chadia`. Points clés à traiter : (1) structure App Router Next.js 15 avec routing i18n, (2) data abstraction layer `/lib/data/` et stratégie de migration V2 vers API, (3) architecture de la Serverless Function Contact avec Resend, (4) configuration Vercel (variables d'environnement, domaine, Speed Insights), (5) stratégie de tests et guard CI. Le backend cible en V2 est dans `dev-organize` (Express.js + Prisma + PostgreSQL/Supabase).

---

*Document généré via session BMAD PM Agent — 2026-04-01*
*Projet : web-chadia | ONG CHADIA | Adoum*
