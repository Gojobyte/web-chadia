# ONG CHADIA — Document d'Architecture Technique

> Version 1.0 · Basé sur PRD v1.0 · Projet : web-chadia

---

## Table des matières

1. [Vue d'ensemble du système](#1-vue-densemble-du-système)
2. [Architecture des pages et routing](#2-architecture-des-pages-et-routing)
3. [Data Abstraction Layer](#3-data-abstraction-layer)
4. [Flux du formulaire de contact](#4-flux-du-formulaire-de-contact)
5. [Pipeline CI/CD et déploiement](#5-pipeline-cicd-et-déploiement)
6. [Migration V1 → V2](#6-migration-v1--v2)
7. [Décisions architecturales clés](#7-décisions-architecturales-clés)

---

## 1. Vue d'ensemble du système

Ce diagramme montre les composants principaux du système et comment ils communiquent entre eux.

```mermaid
graph TB
    subgraph Visiteur
        B[🌐 Navigateur]
    end

    subgraph Vercel["Vercel (hébergement)"]
        CDN[CDN mondial]
        SSG[Pages statiques générées\nau build Next.js 15]
        SF[Serverless Function\n/api/contact]
    end

    subgraph Contenu["Contenu local V1"]
        JSON[Fichiers JSON\n/content/*.json]
        LOCALES[Traductions\n/locales/*.json]
        PDF[Documents\n/public/documents/]
    end

    subgraph Services["Services externes"]
        RESEND[Resend\nEnvoi d'emails]
        GSC[Google Search Console\nIndexation SEO]
        SPEEDS[Vercel Speed Insights\nAnalytics performance]
    end

    subgraph BackendV2["Backend V2 — futur (dev-organize)"]
        API[Express.js + Prisma\n27 modules API]
        DB[(PostgreSQL\nSupabase)]
    end

    B -->|HTTPS| CDN
    CDN --> SSG
    CDN --> SF
    SSG -->|Lit au build| JSON
    SSG -->|Lit au build| LOCALES
    SSG -->|Sert| PDF
    SF -->|API call| RESEND
    RESEND -->|Email| B
    B -->|Métriques| SPEEDS
    GSC -->|Crawl| CDN

    SSG -.->|V2 : remplace JSON par appels API| API
    API --- DB

    style BackendV2 stroke-dasharray: 5 5, fill:#f5f5f5
```

**Légende :**
- Trait plein → flux V1 actuel
- Trait pointillé → évolution prévue en V2
- Le CDN Vercel sert les pages statiques depuis le serveur le plus proche du visiteur

---

## 2. Architecture des pages et routing

### 2.1 Arbre complet des routes

```mermaid
graph TD
    ROOT["/\nHomepage FR"]

    ROOT --> APROPOS["/a-propos\nÀ Propos"]
    ROOT --> DOMAINES["/domaines\nDomaines d'intervention"]
    ROOT --> PROJETS["/projets\nProjets & Réalisations"]
    ROOT --> CONTACT["/contact\nContact + Formulaire"]
    ROOT --> LEGAL["/mentions-legales\nMentions légales"]
    ROOT --> N404["/*\nPage 404"]

    ROOT --> EN["/en/\nHomepage EN"]
    EN --> EN_ABOUT["/en/about\nAbout"]
    EN --> EN_AREAS["/en/areas\nAreas of Work"]
    EN --> EN_PROJECTS["/en/projects\nProjects"]
    EN --> EN_CONTACT["/en/contact\nContact"]
    EN --> EN_LEGAL["/en/legal\nLegal Notice"]

    API["/api/contact\nServerless Function\nPOST only"]

    style LEGAL fill:#f0f0f0
    style EN_LEGAL fill:#f0f0f0
    style API fill:#fff3cd
    style N404 fill:#f8d7da
```

**Notes :**
- Pages grisées → `noindex` (ne pas indexer sur Google)
- Page jaune → Serverless Function, pas une page affichée
- La page 404 (`not-found.tsx`) intercepte toutes les routes non trouvées

### 2.2 Middleware de routing i18n

```mermaid
flowchart TD
    REQ[Requête entrante]
    REQ --> CHECK{Préfixe\n/en/ ?}
    CHECK -->|Oui| SERVE_EN[Servir la version EN\nde la page]
    CHECK -->|Non| ACCEPT{Header\nAccept-Language\ncontient 'en' ?}
    ACCEPT -->|Oui, optionnel V1| REDIRECT[Rediriger vers /en/]
    ACCEPT -->|Non| SERVE_FR[Servir la version FR\nde la page]
    REDIRECT --> SERVE_EN

    style REDIRECT stroke-dasharray: 3 3
```

**Note :** La redirection automatique par `Accept-Language` est optionnelle en V1. La bascule manuelle via le sélecteur suffit au lancement.

### 2.3 Contrôle du sélecteur de langue

```mermaid
flowchart LR
    ENV["Variable d'environnement\nNEXT_PUBLIC_SHOW_LANG_SWITCHER"]
    ENV -->|= false| HIDDEN["Sélecteur masqué\nRoutes /en/ accessibles\ndirectement par URL"]
    ENV -->|= true| VISIBLE["Sélecteur visible\ndans le Header"]

    style HIDDEN fill:#fff3cd
```

**Pourquoi ?** Permet de livrer l'infrastructure i18n en avance, et d'activer le sélecteur sans re-déployer le code — juste en changeant la variable dans Vercel Dashboard.

---

## 3. Data Abstraction Layer

### 3.1 Principe général

```mermaid
graph LR
    subgraph Sources["Sources de données"]
        JSON_C["content/accueil.json\ncontent/domaines.json\ncontent/projets.json\ncontent/about.json\ncontent/contact.json"]
    end

    subgraph Abstraction["lib/data/ — couche d'abstraction"]
        GA["getAccueil()"]
        GD["getDomaines()"]
        GP["getProjets()"]
        GAB["getAbout()"]
        GC["getContact()"]
    end

    subgraph Types["lib/types.ts"]
        T["Accueil\nDomaine\nProjet\nAbout\nContact"]
    end

    subgraph Composants["Composants React\n(Server Components)"]
        HERO["Section Hero"]
        DC["DomainCard"]
        PC["ProjectCard"]
        TEAM["Section Équipe"]
        FORM["Page Contact"]
    end

    JSON_C --> GA
    JSON_C --> GD
    JSON_C --> GP
    JSON_C --> GAB
    JSON_C --> GC

    GA --> HERO
    GA --> TEAM
    GD --> DC
    GP --> PC
    GAB --> TEAM
    GC --> FORM

    T -.-> GA
    T -.-> GD
    T -.-> GP
    T -.-> GAB
    T -.-> GC
```

### 3.2 Flux de données au build (SSG)

```mermaid
sequenceDiagram
    participant Build as next build
    participant getData as lib/data/get*.ts
    participant JSON as content/*.json
    participant Page as Server Component
    participant HTML as HTML statique

    Build->>Page: Appelle la fonction de page
    Page->>getData: Appelle getDomaines() etc.
    getData->>JSON: Lit le fichier JSON
    JSON-->>getData: Retourne les données brutes
    getData-->>Page: Retourne données typées (TypeScript)
    Page-->>HTML: Génère le HTML statique
    HTML-->>Build: Enregistre dans .next/
    Note over HTML: Servi par Vercel CDN sans calcul serveur
```

### 3.3 Composant DomainCard — variantes

```mermaid
flowchart TD
    DC["DomainCard\nProps: id, titre, icone, description\nVariant: 'full' ou 'compact'"]

    DC -->|variant = 'full'\nvaleur par défaut| FULL["Affichage complet\n• Icône\n• Titre\n• Description courte\n• Lien 'En savoir plus'"]
    DC -->|variant = 'compact'| COMPACT["Affichage compact\n• Icône\n• Titre uniquement"]

    FULL -->|Utilisé sur| HOME["Homepage\n(Section Domaines)"]
    COMPACT -->|Utilisé sur| PAGE["/domaines\n(barre navigation rapide)"]
```

---

## 4. Flux du formulaire de contact

### 4.1 Vue générale

```mermaid
sequenceDiagram
    actor Visiteur
    participant Form as Page Contact\n(Client Component)
    participant API as /api/contact\n(Serverless Function)
    participant Resend as Resend API
    participant Email as Boîte email ONG

    Visiteur->>Form: Remplit le formulaire
    Form->>Form: Validation HTML5 native\n(required, type="email")
    Form->>Form: Désactive le bouton\n(prevent double submit)
    Form->>API: POST {nom, email, sujet, message, consentement}

    alt Champ honeypot rempli (bot)
        API-->>Form: HTTP 200 silencieux
        Note over API: Bot croit avoir réussi\nAucun email envoyé
    else RESEND_API_KEY manquante
        API-->>Form: HTTP 503
        Form-->>Visiteur: Message d'erreur non technique
    else Champs invalides
        API-->>Form: HTTP 400
        Form-->>Visiteur: Champs en erreur indiqués
    else Tout valide
        API->>API: Routing selon sujet
        API->>Resend: Envoie l'email
        Resend->>Email: Délivre l'email
        API-->>Form: HTTP 200
        Form-->>Visiteur: Message de confirmation\n(formulaire remplacé)
    end
```

### 4.2 Routing email selon le sujet

```mermaid
flowchart TD
    SUJET{Sujet\ndu formulaire}
    SUJET -->|"= 'Partenariat'"| EP["Envoyé à\nCONTACT_EMAIL_PARTENARIAT"]
    SUJET -->|"= Don\n= Bénévolat\n= Demande d'aide\n= Autre"| EG["Envoyé à\nCONTACT_EMAIL_GENERAL"]

    style EP fill:#d4edda
    style EG fill:#d4edda
```

### 4.3 Protection anti-spam (honeypot)

```mermaid
flowchart LR
    FORM["Formulaire HTML\nVisible par l'utilisateur"]
    HONEY["Champ caché\nname='fax'\nautocomplete='off'\ntabIndex=-1\naria-hidden=true"]

    FORM --- HONEY

    HONEY -->|"Vide\n(utilisateur humain)"| OK["✅ Traitement normal"]
    HONEY -->|"Rempli\n(bot auto-fill)"| FAKE["✅ HTTP 200 silencieux\n❌ Email non envoyé"]

    style HONEY fill:#f8d7da
    style FAKE fill:#fff3cd
```

---

## 5. Pipeline CI/CD et déploiement

### 5.1 Flux de déploiement

```mermaid
flowchart TD
    DEV["Développeur\nbranch feature/xxx"]
    PR["Pull Request\nvers main"]
    GUARD["Guard CI\nVérification mots interdits\n[A VALIDER], [PLACEHOLDER]\n[A REMPLACER], Lorem ipsum"]
    PREVIEW["Déploiement Preview\nweb-chadia-git-xxx.vercel.app"]
    REVIEW["Review + Tests\nmanuels sur preview URL"]
    MERGE["Merge vers main"]
    PROD["Déploiement Production\nong-chadia.org"]

    DEV -->|git push| PR
    PR --> GUARD
    GUARD -->|❌ Mots interdits trouvés| BLOCK["Merge bloqué\nCorrection requise"]
    GUARD -->|✅ Aucun mot interdit| PREVIEW
    PREVIEW --> REVIEW
    REVIEW -->|Approuvé| MERGE
    MERGE --> PROD

    style BLOCK fill:#f8d7da
    style PROD fill:#d4edda
```

### 5.2 Infrastructure Vercel

```mermaid
graph TB
    subgraph DNS["Registrar DNS"]
        A_REC["Enregistrement A\n@ → IP Vercel Dashboard"]
        CNAME_REC["Enregistrement CNAME\nwww → cname.vercel-dns.com"]
        TXT_REC["Enregistrement TXT\nVérification Google Search Console"]
    end

    subgraph Vercel["Vercel Platform"]
        direction TB
        DOMAIN["Domaine configuré\nong-chadia.org\nwww.ong-chadia.org"]
        TLS["Certificat TLS\nLet's Encrypt\nauto-renouvelé"]
        CDN_V["CDN mondial\nEdge Network"]
        ENV_V["Variables d'environnement\nRESEND_API_KEY\nCONTACT_EMAIL_*\nNEXT_PUBLIC_SHOW_LANG_SWITCHER"]
        SI["Speed Insights\nCore Web Vitals"]
    end

    subgraph Redirections["Redirections HTTP 301"]
        HTTP["http://ong-chadia.org"]
        WWW["www.ong-chadia.org"]
        CANONICAL["https://ong-chadia.org"]
    end

    A_REC --> DOMAIN
    CNAME_REC --> DOMAIN
    TXT_REC --> GSC_V["Google Search Console"]
    DOMAIN --> TLS
    TLS --> CDN_V
    HTTP -->|301| CANONICAL
    WWW -->|301| CANONICAL
    CANONICAL --> CDN_V
```

### 5.3 Checklist pré-lancement

```mermaid
graph TD
    C1["☐ RESEND_API_KEY\nconfigurée et testée"]
    C2["☐ Guard PR\naucun mot interdit"]
    C3["☐ Lighthouse mobile\n≥ 70 bloquant"]
    C4["☐ JSON-LD validé\nGoogle Rich Results Test"]
    C5["☐ Formulaire Contact\ntesté sur preview Vercel"]
    C6["☐ DNS configurés\n72h avant lancement"]

    C1 --> GO
    C2 --> GO
    C3 --> GO
    C4 --> GO
    C5 --> GO
    C6 --> GO

    GO{"Tous cochés ?"}
    GO -->|Oui| LAUNCH["🚀 Déploiement Production"]
    GO -->|Non| BLOCK2["Bloquer le lancement"]

    style LAUNCH fill:#d4edda
    style BLOCK2 fill:#f8d7da
```

---

## 6. Migration V1 → V2

### 6.1 Principe de la migration

La migration est possible **sans modifier aucun composant React** grâce au Data Abstraction Layer. Seules les fonctions `getData()` changent.

```mermaid
graph TB
    subgraph V1["V1 — Actuel"]
        GD_V1["getDomaines()\nlit domaines.json\nlocalement"]
        JSON_V1["content/domaines.json"]
        GD_V1 --- JSON_V1
    end

    subgraph V2["V2 — Futur"]
        GD_V2["getDomaines()\nappelle l'API\ndev-organize"]
        API_V2["GET /api/domaines\nExpress.js"]
        DB_V2[("PostgreSQL\nSupabase")]
        GD_V2 --> API_V2 --> DB_V2
    end

    subgraph Composant["Composant React\n(inchangé dans les deux cas)"]
        DC_C["DomainCard\nreçoit les mêmes props\nDomaine[]"]
    end

    GD_V1 -->|"Retourne Domaine[]"| DC_C
    GD_V2 -->|"Retourne Domaine[]"| DC_C

    style V2 stroke-dasharray: 5 5, fill:#f5f5f5
```

### 6.2 Séquence de migration progressive

```mermaid
gantt
    title Plan de migration V1 → V2
    dateFormat  YYYY-MM
    axisFormat  %b %Y

    section V1 (actuel)
    Site vitrine JSON autonome       :done, v1, 2026-04, 3M

    section V2 (backend connecté)
    Connexion API projets            :v2a, after v1, 1M
    Connexion API équipe/personnel   :v2b, after v2a, 1M
    Connexion API actualités         :v2c, after v2b, 1M

    section V3 (portail)
    Portail bénéficiaires            :v3, after v2c, 2M

    section V4 (Arabic/RTL)
    Support arabe + RTL              :v4, after v3, 2M
```

### 6.3 Mapping V1 JSON → V2 API

```mermaid
graph LR
    subgraph V1_FILES["V1 — Fichiers JSON"]
        J1["content/domaines.json"]
        J2["content/projets.json"]
        J3["content/about.json\n(équipe)"]
        J4["content/accueil.json\n(partenaires, chiffres)"]
        J5["content/contact.json"]
    end

    subgraph V2_API["V2 — Endpoints API (dev-organize)"]
        E1["GET /api/domaines"]
        E2["GET /api/projets"]
        E3["GET /api/personnel"]
        E4["GET /api/partenaires\nGET /api/chiffres"]
        E5["GET /api/contact-info"]
    end

    J1 -.->|remplacé par| E1
    J2 -.->|remplacé par| E2
    J3 -.->|remplacé par| E3
    J4 -.->|remplacé par| E4
    J5 -.->|remplacé par| E5
```

---

## 7. Décisions architecturales clés

### DA-001 — SSG plutôt que SSR

| Critère | SSG ✅ | SSR ❌ |
|---|---|---|
| Performance 3G | Pages servies depuis CDN, 0 calcul serveur | Calcul à chaque requête, latence variable |
| Coût | Gratuit sur Vercel (pages statiques) | Consomme des fonctions serverless |
| Contenu JSON | Intégré au build, pas de fetch client | Inutile — le contenu ne change pas en temps réel |
| V2 migration | getData() abstraite — migration transparente | Même abstraction possible |

**Décision :** SSG pour toutes les pages. Exception unique : `/api/contact` (Serverless Function POST).

---

### DA-002 — Polyrepo plutôt que Monorepo

| Critère | Polyrepo ✅ | Monorepo ❌ |
|---|---|---|
| Indépendance V1 | web-chadia déployable sans dev-organize | Couplage fort dès le départ |
| Complexité | Setup simple pour un junior | Turborepo / nx = apprentissage supplémentaire |
| Migration V2 | Appels API cross-repo propres | Imports directs risqués |

**Décision :** Polyrepo. `web-chadia` et `dev-organize` sont deux dépôts indépendants.

---

### DA-003 — Resend plutôt que SMTP direct

| Critère | Resend ✅ | SMTP ONG ❌ |
|---|---|---|
| Quota gratuit | 3 000 emails/mois | Dépend de l'hébergeur email |
| Délivrabilité | Domaine d'envoi vérifié, anti-spam | Risque de blacklist si non configuré |
| Intégration | API simple, SDK Next.js | Config SMTP complexe pour un junior |

**Décision :** Resend en V1. Migration possible vers SMTP propre en V2 si quota insuffisant.

---

### DA-004 — Contenu EN partiel plutôt que traduction complète en V1

**Problème :** Traduction complète de haute qualité prend du temps et de l'argent. Traduction IA de basse qualité nuit à la crédibilité auprès des bailleurs internationaux.

**Solution :** En V1, seuls les textes d'interface (navigation, boutons, formulaire) sont traduits EN. Les contenus longs (descriptions domaines, projets) restent en français avec un bandeau `"Content available in French only"`. Les routes `/en/` sont fonctionnelles.

**Évolution V2 :** Traduction complète des contenus, possiblement via le backend avec champs bilingues en base de données.

---

### DA-005 — Mentions légales en TSX statique plutôt que JSON

**Problème :** Ajouter `getLegal()` + `legal.json` pour du contenu qui change rarément = sur-engineering.

**Solution :** Page TSX avec contenu en dur, marquée `[A VALIDER par direction]`. Modifiable directement dans le fichier quand le contenu évolue. Effort de création : 30 minutes. Effort de maintenance : négligeable.

---

### DA-006 — Feature Flag pour le sélecteur de langue

**Problème :** La traduction EN n'est pas prête au lancement officiel, mais l'infrastructure i18n doit être en place.

**Solution :** Variable d'environnement `NEXT_PUBLIC_SHOW_LANG_SWITCHER`. Passée à `true` dans Vercel Dashboard sans re-déploiement de code quand la traduction est validée.

---

*Document d'architecture généré le 2026-04-01*
*Basé sur PRD v1.0 — ONG CHADIA · Projet web-chadia*
