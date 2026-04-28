# ONG CHADIA — Architecture Technique Back-end

> Version 1.0 · Base sur PRD Back-end v1.0 · Projet : web-chadia-backend

---

## Table des matieres

1. [Vue d'ensemble du systeme](#1-vue-densemble-du-systeme)
2. [Architecture des couches](#2-architecture-des-couches)
3. [Schema Prisma complet](#3-schema-prisma-complet)
4. [Diagrammes de sequence](#4-diagrammes-de-sequence)
5. [Architecture de l'authentification](#5-architecture-de-lauthentification)
6. [Architecture du Panel Admin](#6-architecture-du-panel-admin)
7. [Configuration et Deploiement](#7-configuration-et-deploiement)
8. [Decisions architecturales](#8-decisions-architecturales)

---

## 1. Vue d'ensemble du systeme

### 1.1 Architecture globale

```mermaid
graph TB
    subgraph Internet
        VISITEUR[Visiteur\nong-chadia.com]
        ADMIN_USER[Admin CHADIA\nadmin.ong-chadia.com]
    end

    subgraph Vercel["Vercel (Front Public)"]
        FRONT[Next.js SSG\nSite vitrine]
    end

    subgraph Railway["Railway (Back-end)"]
        BACKEND[Next.js App Router\nAPI + Panel Admin]
        PG[(PostgreSQL)]
    end

    subgraph Services["Services externes"]
        GOOGLE[Google OAuth\nConnexion admin]
        RESEND[Resend\nEmails contact]
        GDRIVE[Google Drive\nDocuments PDF]
    end

    VISITEUR -->|HTTPS| FRONT
    FRONT -->|GET /api/public/*| BACKEND
    ADMIN_USER -->|HTTPS| BACKEND

    BACKEND -->|Prisma ORM| PG
    BACKEND -->|OAuth 2.0| GOOGLE
    BACKEND -->|API| RESEND
    BACKEND -.->|Liens stockes en BDD| GDRIVE

    style Vercel fill:#e8f5e9
    style Railway fill:#e3f2fd
```

### 1.2 Flux des donnees — Vue simplifiee

```
VISITEUR → ong-chadia.com (Vercel)
         → Le front appelle GET /api/public/projets
         → Railway recoit la requete
         → Next.js API Route lit dans PostgreSQL via Prisma
         → Renvoie les donnees en JSON
         → Le front affiche les projets

ADMIN    → admin.ong-chadia.com (Railway)
         → Se connecte via /admin/login
         → NextAuth verifie les identifiants dans PostgreSQL
         → L'admin accede au panel
         → Il modifie un projet via le formulaire
         → Le formulaire appelle PUT /api/admin/projets/:id
         → Prisma met a jour la BDD
         → Le front public voit les changements au prochain chargement
```

---

## 2. Architecture des couches

### 2.1 Les 4 couches du back-end

```mermaid
graph TD
    subgraph Couche1["Couche 1 — Presentation"]
        PAGES[Pages Admin\n/admin/*\nReact Server Components]
        API_ROUTES[API Routes\n/api/*\nRoute Handlers]
    end

    subgraph Couche2["Couche 2 — Validation"]
        ZOD[Schemas Zod\nValidation des donnees entrantes]
        AUTH_CHECK[Verification Auth\nSession + Role]
    end

    subgraph Couche3["Couche 3 — Logique Metier"]
        SERVICES[Services\nRegles metier, logs, emails]
    end

    subgraph Couche4["Couche 4 — Donnees"]
        PRISMA[Prisma Client\nRequetes BDD]
        DB[(PostgreSQL)]
    end

    PAGES --> ZOD
    API_ROUTES --> ZOD
    API_ROUTES --> AUTH_CHECK
    ZOD --> SERVICES
    AUTH_CHECK --> SERVICES
    SERVICES --> PRISMA
    PRISMA --> DB

    style Couche1 fill:#e3f2fd
    style Couche2 fill:#fff3e0
    style Couche3 fill:#f3e5f5
    style Couche4 fill:#e8f5e9
```

**Explication pour debutant :**

Imagine que chaque requete est une lettre qui arrive au bureau de l'ONG :

1. **Couche Presentation** = La reception. Elle recoit la lettre (requete HTTP) et decide ou l'envoyer.
2. **Couche Validation** = Le secretaire. Il verifie que la lettre est bien remplie (donnees valides) et que l'expediteur a le droit d'ecrire (authentification).
3. **Couche Logique Metier** = Le directeur. Il prend les decisions (creer un projet, envoyer un email, ecrire dans les logs).
4. **Couche Donnees** = L'archiviste. Il range ou retrouve les informations dans le classeur (base de donnees).

### 2.2 Structure des dossiers — detaillee

```
web-chadia-backend/
│
├── app/
│   ├── layout.tsx                    # Layout racine
│   ├── page.tsx                      # Redirection → /admin
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth catch-all handler
│   │   │
│   │   ├── public/                   # API publique (pas d'auth)
│   │   │   ├── accueil/
│   │   │   │   └── route.ts          # GET → donnees homepage
│   │   │   ├── domaines/
│   │   │   │   ├── route.ts          # GET → liste domaines
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET → detail domaine
│   │   │   ├── projets/
│   │   │   │   ├── route.ts          # GET → liste projets
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET → detail projet
│   │   │   ├── about/
│   │   │   │   └── route.ts          # GET → infos a propos
│   │   │   └── contact/
│   │   │       ├── route.ts          # GET → infos contact
│   │   │       └── message/
│   │   │           └── route.ts      # POST → envoi message
│   │   │
│   │   └── admin/                    # API admin (auth requise)
│   │       ├── projets/
│   │       │   ├── route.ts          # GET (liste) + POST (creer)
│   │       │   └── [id]/
│   │       │       └── route.ts      # PUT (modifier) + DELETE
│   │       ├── domaines/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── equipe/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── partenaires/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── chiffres/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── infos-ong/
│   │       │   └── route.ts          # GET + PUT (singleton)
│   │       ├── contact-info/
│   │       │   └── route.ts          # GET + PUT (singleton)
│   │       ├── messages/
│   │       │   ├── route.ts          # GET (liste)
│   │       │   └── [id]/
│   │       │       ├── route.ts      # DELETE
│   │       │       └── read/
│   │       │           └── route.ts  # PUT (marquer lu)
│   │       ├── users/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── logs/
│   │           └── route.ts          # GET (liste)
│   │
│   └── admin/                        # Pages du panel admin
│       ├── layout.tsx                # Layout admin (sidebar + header)
│       ├── page.tsx                  # Dashboard
│       ├── login/
│       │   └── page.tsx
│       ├── projets/
│       │   ├── page.tsx              # Liste des projets
│       │   ├── nouveau/
│       │   │   └── page.tsx          # Formulaire creation
│       │   └── [id]/
│       │       └── page.tsx          # Formulaire edition
│       ├── domaines/
│       │   ├── page.tsx
│       │   ├── nouveau/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── equipe/
│       │   └── page.tsx              # Liste + drag & drop
│       ├── partenaires/
│       │   └── page.tsx
│       ├── chiffres/
│       │   └── page.tsx
│       ├── a-propos/
│       │   └── page.tsx              # Formulaire edition
│       ├── contact/
│       │   └── page.tsx              # Infos + messages
│       ├── utilisateurs/
│       │   └── page.tsx              # Super Admin only
│       └── logs/
│           └── page.tsx              # Super Admin only
│
├── lib/
│   ├── prisma.ts                     # Client Prisma singleton
│   ├── auth.ts                       # Configuration NextAuth
│   ├── auth-guard.ts                 # Helper verification role
│   ├── logger.ts                     # Service de logging en BDD
│   ├── email.ts                      # Service envoi email (Resend)
│   ├── cors.ts                       # Configuration CORS
│   │
│   ├── schemas/                      # Schemas de validation Zod
│   │   ├── projet.ts
│   │   ├── domaine.ts
│   │   ├── equipe.ts
│   │   ├── partenaire.ts
│   │   ├── chiffre.ts
│   │   ├── infos-ong.ts
│   │   ├── contact.ts
│   │   ├── message.ts
│   │   └── user.ts
│   │
│   └── utils/
│       ├── api-response.ts           # Helpers reponse JSON standardisee
│       └── pagination.ts             # Helper pagination
│
├── components/
│   └── admin/
│       ├── sidebar.tsx               # Navigation laterale
│       ├── header.tsx                # Barre superieure
│       ├── data-table.tsx            # Tableau reutilisable
│       ├── form-field.tsx            # Champ de formulaire reutilisable
│       ├── confirm-dialog.tsx        # Modale de confirmation
│       ├── sortable-list.tsx         # Liste drag & drop
│       └── stats-card.tsx            # Widget statistique dashboard
│
├── prisma/
│   ├── schema.prisma                 # Schema complet BDD
│   ├── seed.ts                       # Import donnees V1
│   └── migrations/                   # Generees automatiquement
│
├── public/                           # Assets statiques admin
│
├── .env.example                      # Template variables d'environnement
├── .env                              # Variables locales (git ignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Schema Prisma complet

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// AUTHENTIFICATION & UTILISATEURS
// ============================================================

enum Role {
  SUPER_ADMIN
  ADMIN
  EMPLOYE
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String?   // Null si connexion Google uniquement
  role          Role      @default(EMPLOYE)
  image         String?
  googleId      String?   @unique

  // Relations
  projetsCreated  Projet[]         @relation("ProjetCreatedBy")
  infosOngUpdated InfosONG[]       @relation("InfosONGUpdatedBy")
  contactUpdated  ContactInfo[]    @relation("ContactUpdatedBy")
  messagesRead    MessageContact[] @relation("MessageReadBy")
  logs            LogActivite[]

  // NextAuth
  accounts Account[]
  sessions Session[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// Tables requises par NextAuth (Prisma Adapter)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ============================================================
// CONTENU DU SITE
// ============================================================

model Projet {
  id          String   @id @default(cuid())
  titre       String
  description String   @db.Text
  statut      String   @default("en cours") // "en cours" | "termine"
  dateDebut   DateTime
  dateFin     DateTime?
  image       String?
  featured    Boolean  @default(false)
  responsable String?

  // Relations
  domaine            Domaine              @relation(fields: [domaineId], references: [id])
  domaineId          String
  zonesGeographiques ZoneGeographique[]   @relation("ProjetZones")
  indicateursImpact  IndicateurImpact[]   @relation("ProjetIndicateurs")
  createdBy          User?                @relation("ProjetCreatedBy", fields: [createdById], references: [id])
  createdById        String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("projets")
}

model Domaine {
  id               String  @id @default(cuid())
  titre            String
  icone            String
  description      String
  descriptionLongue String @db.Text
  featured         Boolean @default(false)

  // Relations
  projets           Projet[]
  activitesCles     ActiviteCle[]
  indicateursImpact IndicateurImpact[]   @relation("DomaineIndicateurs")
  zonesActives      ZoneGeographique[]   @relation("DomaineZones")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("domaines")
}

model ZoneGeographique {
  id  String @id @default(cuid())
  nom String @unique

  // Relations many-to-many
  projets  Projet[]  @relation("ProjetZones")
  domaines Domaine[] @relation("DomaineZones")

  @@map("zones_geographiques")
}

model ActiviteCle {
  id        String @id @default(cuid())
  label     String
  ordre     Int    @default(0)

  domaine   Domaine @relation(fields: [domaineId], references: [id], onDelete: Cascade)
  domaineId String

  @@map("activites_cles")
}

model IndicateurImpact {
  id     String @id @default(cuid())
  valeur String
  label  String

  // Peut appartenir a un Projet OU a un Domaine (pas les deux)
  projet     Projet?  @relation("ProjetIndicateurs", fields: [projetId], references: [id], onDelete: Cascade)
  projetId   String?
  domaine    Domaine? @relation("DomaineIndicateurs", fields: [domaineId], references: [id], onDelete: Cascade)
  domaineId  String?

  @@map("indicateurs_impact")
}

model MembreEquipe {
  id          String    @id @default(cuid())
  nom         String
  poste       String
  photo       String?
  institution String?
  consent     Boolean   @default(false)
  consentDate DateTime?
  ordre       Int       @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("membres_equipe")
}

model Partenaire {
  id    String  @id @default(cuid())
  nom   String
  logo  String
  url   String?
  ordre Int     @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("partenaires")
}

model ChiffreCle {
  id     String  @id @default(cuid())
  valeur String
  unite  String?
  label  String
  ordre  Int     @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("chiffres_cles")
}

// ============================================================
// INFOS GLOBALES DE L'ONG (tables singleton)
// ============================================================

model InfosONG {
  id                   String  @id @default("singleton")
  heroTitre            String  @default("")
  heroTagline          String  @default("")
  heroMetaDescription  String  @default("")
  precomBadgeVisible   Boolean @default(true)
  precomBadgeTexte     String  @default("")
  histoire             String  @default("") @db.Text
  vision               String  @default("") @db.Text
  mission              String  @default("") @db.Text
  statutLegalNumero    String  @default("")
  statutLegalDate      String  @default("")
  statutLegalAutorite  String  @default("")
  ctaWhatsappMessage   String  @default("")

  // Relations
  valeurs     Valeur[]
  updatedBy   User?    @relation("InfosONGUpdatedBy", fields: [updatedById], references: [id])
  updatedById String?

  updatedAt DateTime @updatedAt

  @@map("infos_ong")
}

model Valeur {
  id          String @id @default(cuid())
  titre       String
  description String
  ordre       Int    @default(0)

  infosONG   InfosONG @relation(fields: [infosONGId], references: [id], onDelete: Cascade)
  infosONGId String

  @@map("valeurs")
}

// ============================================================
// CONTACT
// ============================================================

model ContactInfo {
  id        String @id @default("singleton")
  email     String @default("")
  telephone String @default("")
  adresse   String @default("")
  horaires  String @default("")
  whatsapp  String @default("")

  updatedBy   User?  @relation("ContactUpdatedBy", fields: [updatedById], references: [id])
  updatedById String?

  updatedAt DateTime @updatedAt

  @@map("contact_info")
}

model MessageContact {
  id      String @id @default(cuid())
  nom     String
  email   String
  sujet   String
  message String @db.Text
  statut  String @default("non_lu") // "non_lu" | "lu" | "archive"

  readBy   User?   @relation("MessageReadBy", fields: [readById], references: [id])
  readById String?
  readAt   DateTime?

  createdAt DateTime @default(now())

  @@map("messages_contact")
}

// ============================================================
// LOGS
// ============================================================

model LogActivite {
  id       String @id @default(cuid())
  action   String // "CREATE" | "UPDATE" | "DELETE"
  entite   String // "Projet" | "Domaine" | etc.
  entiteId String
  details  String? @db.Text // JSON stringifie des changements

  user   User   @relation(fields: [userId], references: [id])
  userId String

  createdAt DateTime @default(now())

  @@index([entite, entiteId])
  @@index([userId])
  @@index([createdAt])
  @@map("logs_activite")
}
```

---

## 4. Diagrammes de sequence

### 4.1 Visiteur consulte les projets (API publique)

```mermaid
sequenceDiagram
    participant V as Visiteur
    participant F as Front (Vercel)
    participant B as Back-end (Railway)
    participant DB as PostgreSQL

    V->>F: Visite /projets
    F->>B: GET /api/public/projets?statut=en+cours
    B->>DB: SELECT * FROM projets WHERE statut = 'en cours'
    DB-->>B: Liste des projets
    B-->>F: JSON { projets: [...] }
    F-->>V: Affiche la page avec les projets
```

### 4.2 Admin se connecte et modifie un projet

```mermaid
sequenceDiagram
    participant A as Admin
    participant P as Panel Admin
    participant AUTH as NextAuth
    participant API as API Admin
    participant DB as PostgreSQL

    Note over A,DB: Phase 1 — Connexion
    A->>P: Accede a /admin/login
    A->>P: Entre email + mot de passe
    P->>AUTH: POST /api/auth/login
    AUTH->>DB: Verifie email + compare hash mdp
    DB-->>AUTH: Utilisateur trouve, role = ADMIN
    AUTH-->>P: Session JWT (token)
    P-->>A: Redirection vers /admin (dashboard)

    Note over A,DB: Phase 2 — Modification d'un projet
    A->>P: Clique sur "Modifier" un projet
    P->>API: GET /api/admin/projets/proj-001
    API->>DB: SELECT * FROM projets WHERE id = 'proj-001'
    DB-->>API: Donnees du projet
    API-->>P: JSON du projet
    P-->>A: Affiche le formulaire pre-rempli

    A->>P: Modifie le titre et clique "Enregistrer"
    P->>API: PUT /api/admin/projets/proj-001
    Note over API: Verifie session + role ADMIN
    Note over API: Valide les donnees avec Zod
    API->>DB: UPDATE projets SET titre = '...' WHERE id = 'proj-001'
    API->>DB: INSERT INTO logs_activite (action='UPDATE', entite='Projet', ...)
    DB-->>API: OK
    API-->>P: { success: true }
    P-->>A: "Projet modifie avec succes"
```

### 4.3 Visiteur envoie un message de contact

```mermaid
sequenceDiagram
    participant V as Visiteur
    participant F as Front (Vercel)
    participant B as Back-end (Railway)
    participant DB as PostgreSQL
    participant R as Resend (Email)

    V->>F: Remplit le formulaire de contact
    F->>F: Verifie le honeypot (champ "fax" doit etre vide)
    F->>B: POST /api/public/contact/message
    Note over B: Rate limit check (10/heure par IP)
    Note over B: Validation Zod (nom, email, sujet, message)
    B->>DB: INSERT INTO messages_contact (...)
    B->>R: Envoi email notification a l'admin
    R-->>B: Email envoye
    B-->>F: { success: true }
    F-->>V: "Votre message a ete envoye"
```

### 4.4 Super Admin cree un nouvel utilisateur

```mermaid
sequenceDiagram
    participant SA as Super Admin
    participant P as Panel Admin
    participant API as API Admin
    participant DB as PostgreSQL
    participant R as Resend (Email)

    SA->>P: Va sur /admin/utilisateurs
    SA->>P: Clique "Nouvel utilisateur"
    SA->>P: Remplit : nom, email, role = ADMIN
    P->>API: POST /api/admin/users
    Note over API: Verifie session + role SUPER_ADMIN
    Note over API: Genere un mot de passe temporaire
    API->>DB: INSERT INTO users (email, name, role, passwordHash)
    API->>DB: INSERT INTO logs_activite (action='CREATE', entite='User')
    API->>R: Envoi email avec identifiants temporaires
    R-->>API: Email envoye
    API-->>P: { success: true, tempPassword: '...' }
    P-->>SA: "Utilisateur cree. Email envoye."
```

---

## 5. Architecture de l'authentification

### 5.1 Flux d'authentification

```mermaid
graph TD
    LOGIN[Page /admin/login] --> CHOICE{Methode ?}

    CHOICE -->|Email + mdp| CRED[Provider Credentials]
    CHOICE -->|Google| GOOG[Provider Google OAuth]

    CRED --> VERIFY_PASS[Verifie le hash bcrypt]
    VERIFY_PASS -->|OK| SESSION
    VERIFY_PASS -->|KO| ERROR[Erreur : identifiants incorrects]
    ERROR --> RATE[Rate limiter incremente]
    RATE -->|> 5 tentatives| BLOCKED[Bloque 15 min]
    RATE -->|< 5 tentatives| LOGIN

    GOOG --> GOOGLE_API[Google renvoie le profil]
    GOOGLE_API --> CHECK_USER{Utilisateur existe\nen BDD ?}
    CHECK_USER -->|Oui| SESSION
    CHECK_USER -->|Non| DENIED[Acces refuse\nCompte non cree par Super Admin]

    SESSION[Session JWT creee\nStockee en cookie HttpOnly]
    SESSION --> REDIRECT[Redirection /admin]

    style BLOCKED fill:#ffcdd2
    style DENIED fill:#ffcdd2
    style SESSION fill:#c8e6c9
```

**Point important :** La connexion Google ne cree PAS de compte automatiquement. Le Super Admin doit d'abord creer le compte avec l'email Google de la personne. Ensuite, cette personne peut se connecter avec Google.

### 5.2 Verification des permissions (auth-guard)

```mermaid
graph TD
    REQ[Requete API admin] --> CHECK_SESSION{Session\nvalide ?}
    CHECK_SESSION -->|Non| R401[401 Unauthorized]
    CHECK_SESSION -->|Oui| GET_ROLE[Recupere le role\ndepuis la session]
    GET_ROLE --> CHECK_PERM{Role suffisant\npour cette action ?}
    CHECK_PERM -->|Non| R403[403 Forbidden]
    CHECK_PERM -->|Oui| EXECUTE[Execute l'action]

    style R401 fill:#ffcdd2
    style R403 fill:#ffcdd2
    style EXECUTE fill:#c8e6c9
```

### 5.3 Hierarchie des roles

```
SUPER_ADMIN (niveau 3)
    ├── Tout ce que ADMIN peut faire
    ├── Gerer les utilisateurs
    └── Voir les logs d'activite

ADMIN (niveau 2)
    ├── Tout ce que EMPLOYE peut faire
    ├── Creer / Modifier / Supprimer du contenu
    └── Gerer les messages de contact

EMPLOYE (niveau 1)
    └── Lecture seule sur tout le panel
```

---

## 6. Architecture du Panel Admin

### 6.1 Layout et navigation

```
┌────────────────────────────────────────────────────────────┐
│  HEADER                                         [Adoum ▾] │
│  ONG CHADIA — Administration                   Deconnexion │
├──────────┬─────────────────────────────────────────────────┤
│          │                                                 │
│ SIDEBAR  │  CONTENU DE LA PAGE                             │
│          │                                                 │
│ Dashboard│  ┌─────────────────────────────────────────┐    │
│ Projets  │  │                                         │    │
│ Domaines │  │  (Varie selon la page)                  │    │
│ Equipe   │  │                                         │    │
│ Partenair│  │  Ex: Tableau des projets                │    │
│ A Propos │  │      avec boutons d'action              │    │
│ Contact  │  │                                         │    │
│ Chiffres │  └─────────────────────────────────────────┘    │
│          │                                                 │
│ ──────── │  (Uniquement Super Admin :)                     │
│ Users    │                                                 │
│ Logs     │                                                 │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

### 6.2 Composants reutilisables

| Composant | Utilise dans | Description |
|-----------|-------------|-------------|
| `DataTable` | Projets, Domaines, Messages, Users, Logs | Tableau avec tri, filtres, pagination |
| `FormField` | Tous les formulaires | Input avec label, erreur, validation |
| `ConfirmDialog` | Suppression | Modale "Etes-vous sur ?" |
| `SortableList` | Equipe, Partenaires, Chiffres, Valeurs | Liste drag & drop pour reordonner |
| `StatsCard` | Dashboard | Widget avec icone + chiffre + label |
| `Sidebar` | Layout admin | Navigation laterale |
| `Header` | Layout admin | Barre superieure avec user info |

---

## 7. Configuration et Deploiement

### 7.1 Variables d'environnement

```bash
# .env.example

# ---- Base de donnees ----
DATABASE_URL="postgresql://user:password@host:5432/chadia_db"

# ---- NextAuth ----
NEXTAUTH_URL="http://localhost:3000"        # URL du back-end
NEXTAUTH_SECRET="votre-secret-aleatoire"    # openssl rand -base64 32

# ---- Google OAuth ----
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# ---- Resend (Emails) ----
RESEND_API_KEY="re_xxx"
CONTACT_EMAIL_GENERAL="chadiaong@gmail.com"
CONTACT_EMAIL_PARTENARIAT="chadiaong@gmail.com"

# ---- Super Admin initial ----
SUPER_ADMIN_EMAIL="adoum@example.com"
SUPER_ADMIN_PASSWORD="mot-de-passe-initial"

# ---- CORS ----
ALLOWED_ORIGINS="https://ong-chadia.com,https://www.ong-chadia.com"

# ---- Frontend public URL (pour les liens dans les emails) ----
FRONTEND_URL="https://ong-chadia.com"
```

### 7.2 Architecture de deploiement

```mermaid
graph LR
    subgraph Dev["Developpement local"]
        CODE[Code source\ngit push]
    end

    subgraph GitHub
        REPO[Repository\nweb-chadia-backend]
    end

    subgraph Railway["Railway (Production)"]
        APP[Next.js App\nBuild automatique]
        DB[(PostgreSQL\nManage par Railway)]
    end

    subgraph Vercel["Vercel (Front)"]
        FRONT[Site vitrine\nong-chadia.com]
    end

    CODE -->|git push main| REPO
    REPO -->|Deploy automatique| APP
    APP -->|Prisma| DB
    FRONT -->|API calls| APP
```

### 7.3 Domaines

| Service | Domaine | Hebergeur |
|---------|---------|-----------|
| Site public | `ong-chadia.com` | Vercel |
| Back-end + Admin | `admin.ong-chadia.com` | Railway |

### 7.4 Pipeline de deploiement

```
1. Developeur push sur main
2. Railway detecte le push
3. Railway execute : npm install → npx prisma generate → npm run build
4. Railway deploie la nouvelle version
5. Si migration Prisma necessaire : executee automatiquement
6. Zero downtime (Railway gere le switch)
```

---

## 8. Decisions architecturales

### DA-1 : Un seul projet Next.js pour API + Admin (pas de separation)

**Decision :** Le back-end est un seul projet Next.js qui contient a la fois les API Routes et les pages du panel admin.

**Pourquoi :**
- Simplifie le developpement (un seul repo, un seul deploiement)
- Les pages admin peuvent appeler les API directement cote serveur (Server Components) sans passer par HTTP
- Moins de configuration CORS a gerer (API et admin sur le meme domaine)
- Adapte a la taille du projet (une ONG, pas Google)

**Alternative rejetee :** Separer API (Express) et Admin (React SPA). Trop complexe pour le benefice.

### DA-2 : NextAuth avec Prisma Adapter (pas de JWT custom)

**Decision :** Utiliser NextAuth.js v5 avec le Prisma Adapter pour gerer l'authentification.

**Pourquoi :**
- Integration native avec Next.js (middleware, session dans les Server Components)
- Le Prisma Adapter stocke les sessions en BDD automatiquement
- Support Google OAuth inclus
- Communaute large, bien documente

**Alternative rejetee :** JWT custom avec jose. Plus de controle mais beaucoup plus de code a ecrire et maintenir.

### DA-3 : Pas de connexion Google auto-create

**Decision :** La connexion Google ne cree PAS automatiquement un compte. Le Super Admin doit d'abord creer le compte.

**Pourquoi :**
- Le panel est interne. N'importe qui avec un compte Google ne doit pas pouvoir y acceder.
- Le Super Admin garde le controle total sur qui a acces.
- Le role est defini a la creation du compte, pas a la premiere connexion.

### DA-4 : Tables singleton pour InfosONG et ContactInfo

**Decision :** `InfosONG` et `ContactInfo` ont un `id` fixe a `"singleton"`. Une seule ligne par table.

**Pourquoi :**
- Ces donnees sont globales (il n'y a qu'une seule ONG, qu'une seule adresse de contact)
- Pas besoin de CRUD complet, juste GET et PUT
- Le seed cree la ligne initiale, ensuite on ne fait que la modifier

### DA-5 : Zod pour la validation (pas de class-validator ni Joi)

**Decision :** Utiliser Zod pour valider toutes les donnees entrantes.

**Pourquoi :**
- TypeScript-first : les types sont inferes automatiquement depuis les schemas
- Leger et rapide
- Les schemas peuvent etre partages entre l'API (validation serveur) et les formulaires admin (validation client)
- Tres populaire dans l'ecosysteme Next.js

### DA-6 : Logs d'activite en BDD (pas de service externe)

**Decision :** Les logs d'activite sont stockes dans une table PostgreSQL, pas dans un service externe (Datadog, Sentry, etc.).

**Pourquoi :**
- Suffisant pour le besoin (savoir qui a modifie quoi)
- Pas de cout supplementaire
- Consultable directement depuis le panel admin
- On peut toujours ajouter un service externe plus tard si necessaire

### DA-7 : Railway plutot que Vercel pour le back-end

**Decision :** Heberger le back-end sur Railway plutot que sur Vercel.

**Pourquoi :**
- Railway offre PostgreSQL integre (pas besoin d'un service tiers)
- Le plan gratuit est suffisant pour demarrer
- Deploiement automatique depuis GitHub
- Mieux adapte a un back-end avec BDD qu'a Vercel (qui est optimise pour le frontend/serverless)

---

> **Prochain document** : On a le PRD et l'architecture. On est pret a coder l'Epic 1 !
