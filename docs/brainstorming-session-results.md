# Brainstorming Session — Site Web ONG CHADIA

**Date** : 03 mars 2026
**Facilitateur** : Claude (methode BMAD)
**Participant** : Adoum
**Techniques utilisees** : What If Scenarios, Role Playing, Mind Mapping

---

## Resume executif

### Sujet et objectifs

Brainstorming pour la conception du site web public de l'ONG nationale CHADIA (Tchad). L'objectif etait d'explorer largement les besoins, les publics cibles, les fonctionnalites et l'architecture du site avant de passer a une ideation focalisee.

### Techniques utilisees

1. **What If Scenarios** — Exploration des differentes perspectives utilisateurs
2. **Role Playing** — Mise en situation (Directeur Pays face au PNUD, jeune tchadien au chomage, femme victime de VBG, membre du personnel)
3. **Mind Mapping** — Structuration et priorisation des idees

### Themes et patterns cles identifies

- **Double audience** : le site doit servir a la fois les bailleurs/partenaires (vitrine de credibilite) ET les beneficiaires directs (outil utile et accessible)
- **Mobile-first obligatoire** : les beneficiaires accedent via telephone avec connexion 3G
- **Credibilite avant tout** : pour les donateurs, chaque element doit prouver le serieux et la capacite d'execution de CHADIA
- **Connexion future au backend** : le site sera autonome en V1 puis connecte progressivement a la plateforme interne `dev-organize`

---

## Technique 1 : What If Scenarios

### Scenario 1 — Visiteur qui decouvre CHADIA pour la premiere fois

**Question** : Qu'est-ce qu'il devrait comprendre en 5 secondes ?

**Idees generees** :

- Nom et statut : ONG Nationale CHADIA, organisation de droit tchadien a but non lucratif
- Enregistree sous le numero N°154/PCMT/PMT/MEPDCI/SE/SPONGAH/2021
- Creee le 08 decembre 2021
- Vision : contribuer a l'emergence d'un Tchad plus equitable, resilient et prospere
- Mission : concevoir et mettre en oeuvre des actions de developpement et d'appui humanitaire
- Valeurs : engagement communautaire, professionnalisme, innovation, integrite, inclusion sociale, partenariat, durabilite, responsabilite
- 6 domaines d'intervention :
  1. Entrepreneuriat, employabilite et autonomisation economique
  2. Structuration et competitivite des entreprises existantes
  3. Digitalisation, innovation et commercialisation
  4. Prevention et reponse aux violences basees sur le genre (projet ADALA)
  5. Eau, hygiene et assainissement (WASH)
  6. Innovation dans l'agro-sylvo-pastoralisme
- Approche fondee sur la participation communautaire, le renforcement des capacites locales et la co-construction
- Projets realises et en cours (PNUD, BADEA, Union Africaine, ONG turque ALPAY, FER)

### Scenario 2 — Donateur potentiel (PNUD, BADEA, agence UN) a 23h depuis Geneve

**Question** : Qu'est-ce qui convaincrait de contacter CHADIA plutot qu'une autre ONG tchadienne ?

**Idees generees** :

Le site doit transmettre une impression immediate de **serieux, credibilite et impact concret**.

Trois forces rares a montrer :
- **Excellente connaissance du terrain** : besoins reels, dynamiques locales, acteurs institutionnels
- **Expertise technique solide** : WASH, entrepreneuriat, VBG, agro-sylvo-pastoralisme, infrastructures
- **Capacite a transformer les idees en resultats concrets** : projets realises, montants geres, partenaires reconnus

Elements differenciants a mettre en avant :
- Realisations concretes avec chiffres, zones d'intervention et partenaires
- Vision claire (agir sur les causes profondes, pas les symptomes)
- Equipe credible avec profils experimentes et gouvernance rassurante
- Approche partenariale et durable
- Identite visuelle professionnelle, sobre, moderne

Le donateur doit se dire : "Cette ONG connait son contexte, sait ou elle va, parle avec clarte, montre des preuves, et semble capable de porter des projets serieux avec un vrai impact."

### Scenario 3 — Jeune tchadien de 22 ans au chomage / Femme victime de VBG

**Question** : Le site est-il uniquement vitrine ou aussi utile pour les beneficiaires ?

**Idees generees** :

Le site doit etre concu selon une logique a **double audience** :

**Pour le jeune au chomage** :
- Decouvrir les programmes de formation et d'entrepreneuriat
- Consulter les opportunites (formations, appels a candidatures, projets, evenements)
- S'inscrire a une formation ou deposer une demande d'accompagnement
- Acceder a des ressources utiles (guides pratiques, outils numeriques)
- Contacter facilement l'organisation (formulaire, WhatsApp, telephone, reseaux sociaux)

**Pour la femme victime de VBG** (avec prudence, simplicite et confidentialite) :
- Comprendre quels types d'appui existent
- Trouver des informations claires sur les recours possibles
- Acceder a des numeros de contact ou points d'ecoute
- Demander une orientation ou une assistance de maniere discrete
- Etre redirigee vers les services competents

**Conclusion** : Le site doit etre a la fois une vitrine de confiance pour les bailleurs, un outil utile pour les communautes, et un pont concret entre l'organisation et ses beneficiaires.

---

## Technique 2 : Role Playing

### Role 1 — Directeur Pays de CHADIA (test PNUD)

**Situation** : Un representant du PNUD demande le lien du site. Quelles pages verifier en priorite ?

**Priorites identifiees** (dans l'ordre) :

1. **Page d'accueil** — Clarte, professionnalisme, chiffres cles, axes d'intervention
2. **A propos / Presentation institutionnelle** — Statut juridique, date de creation, enregistrement, vision, mission, valeurs
3. **Gouvernance / Equipe dirigeante** — Profils cles, competences, credibilite
4. **Domaines d'intervention** — 6 axes organises, lisibles, avec exemples et resultats
5. **Projets / Realisations / References** — Preuves concretes, montants, partenaires, localisations
6. **Partenaires / Reseaux** — Ecosysteme relationnel
7. **Zones d'intervention** — Capacite de deploiement territorial (carte)
8. **Actualites** — Prouver que l'ONG est active et operationnelle
9. **Page contact** — Email, telephone, formulaire, WhatsApp, zero friction
10. **Documents a telecharger** — Brochure, rapport d'activite, fiche conceptuelle
11. **Transparence / conformite** — Statut legal, engagements ethiques, protection beneficiaires
12. **Appels a action** — Travailler avec nous, Nous contacter, Voir nos projets

### Role 2 — Jeune femme de 24 ans (mobile, 3G)

**Constats cles** :

- Cherche : "Qu'est-ce que CHADIA peut faire pour moi, maintenant ?"
- 3 questions immediates : Y a-t-il une formation ? Comment s'inscrire ? CHADIA aide des personnes comme moi ?
- **Quitte le site en 3 a 5 secondes** si c'est lent ou confus

**Implications design** :
- Mobile-first (pas juste "adapte" au mobile)
- Message utile visible immediatement en haut de page
- Boutons gros et clairs : Voir les formations, Demander un accompagnement, WhatsApp
- Tres peu de texte au premier ecran
- Vitesse maximale (images compressees, pas d'animations lourdes)
- Navigation ultra simple (5 entrees max)
- Actions immediates sans effort
- Reassurance rapide (photos reelles, temoignages)

### Role 3 — Membre du personnel (lien avec backend)

**Constat** : Le backend `dev-organize` existe deja avec 27 modules API complets :
- Auth (JWT, roles SUPER_ADMIN/STAFF/CONTRIBUTOR/GUEST/DONOR)
- GED (documents, versioning, recherche, partage)
- Projets (CRUD, membres, statuts, dashboard)
- Budgets (templates, formules, compliance, projections)
- Propositions (collaboration, templates, export)
- Formulaires dynamiques
- Signatures digitales
- Opportunites et alertes
- Monitoring et rapports schedules
- Analytics et dashboards
- Portail donateurs
- Notifications push

**Decision** : Le site public sera autonome en V1, puis connecte progressivement au backend.

---

## Technique 3 : Mind Mapping

### Carte mentale finale

```
                        SITE WEB CHADIA
                             |
        +--------------------+--------------------+
        |                    |                    |
   VITRINE BAILLEUR   ESPACE BENEFICIAIRE    TECHNIQUE
        |                    |                    |
   - Accueil            - Formations         - Mobile-first
   - A propos           - Inscription        - Rapide (3G)
   - Gouvernance        - Accompagnement     - 3 langues
   - Domaines           - Espace VBG         - SEO
   - Projets            - Contact rapide     - Autonome V1
   - Partenaires        - WhatsApp           - Backend V3+
   - Zones              - Ressources
   - Actualites
   - Documents
   - Transparence
```

---

## Categorisation des idees

### Immediat (V1 — MVP)

**Pages** :
- Accueil (chiffres cles, CTA, impact immediat)
- A propos (statut juridique, vision, mission, valeurs)
- Domaines d'intervention (6 axes)
- Projets / Realisations (preuves concretes)
- Contact (formulaire + WhatsApp + telephone)

**Blocs integres** :
- Equipe dirigeante
- Partenaires / references
- Chiffres cles
- 1 document telechargeable (brochure institutionnelle)

**Contraintes** :
- Mobile-first, rapide, sobre et professionnel
- SEO de base
- Francais + Anglais minimum

### Futur proche (V2 — Enrichissement)

- Page partenaires dediee
- Zones d'intervention
- Actualites / Blog
- Formations / Opportunites
- Formulaire d'inscription en ligne
- Documents telechargeables (multiples)
- Transparence / conformite
- Arabe complet + support RTL

### Moyen terme (V3 — Backend connecte)

- Projets dynamiques depuis la plateforme interne
- Actualites gerees depuis le back-office
- Formulaires connectes au module Forms existant
- Gestion de contenu administrable (CMS)

### Long terme (V4 — Fonctions avancees)

- Portail donateur (module existant dans le backend)
- Espace VBG securise
- Cartographie interactive avancee
- Services beneficiaires specialises

---

## Plan d'action

### Top 3 des priorites

1. **Construire le site V1 (MVP)** — 5 pages + blocs integres, mobile-first, FR+EN, design professionnel et sobre
   - Raison : c'est le minimum pour etre credible face aux partenaires internationaux
   - Prochaine etape : creer le PRD avec le PM agent BMAD

2. **Definir l'identite visuelle** — Charte graphique, couleurs, typographie, logo
   - Raison : l'image de marque est essentielle pour la credibilite
   - Prochaine etape : brief UX/design

3. **Preparer le contenu** — Textes, chiffres, photos, document telechargeable
   - Raison : un beau site sans contenu concret ne sert a rien
   - Prochaine etape : collecter les donnees aupres de l'equipe CHADIA

### Ressources necessaires

- Contenu redige en francais et anglais (textes institutionnels, descriptions projets)
- Photos professionnelles des projets et de l'equipe
- Logo et charte graphique de CHADIA
- Donnees chiffrees (montants, beneficiaires, zones)
- Document institutionnel a mettre en telechargement
- Nom de domaine et hebergement

### Questions pour les prochaines sessions

- Quel est le nom de domaine prevu ? (ong-chadia.org ? chadia-tchad.org ?)
- Y a-t-il deja un logo et une charte graphique ?
- Quelles photos sont disponibles ?
- Le contenu est-il deja redige en francais ? Faut-il le traduire ?
- Quel framework/technologie pour le front-end du site public ?
- Quel hebergement prevu pour le site public ?

---

## Reflexion et suivi

### Ce qui a bien fonctionne

- Les "What If Scenarios" ont permis de definir clairement la double audience du site
- Le "Role Playing" (Directeur Pays face au PNUD) a genere l'architecture complete des pages
- La perspective mobile (jeune femme sur 3G) a impose des contraintes design concretes
- La decouverte du backend existant a clarifie la strategie de connexion progressive

### Pistes pour exploration future

- Design system et identite visuelle
- Strategie de contenu et SEO
- Architecture technique detaillee (framework, i18n, hebergement)
- Strategie de connexion progressive avec le backend `dev-organize`
- Accessibilite (au-dela du mobile-first)

### Prochaines etapes recommandees (methode BMAD)

1. **PM Agent** : Creer le PRD (Product Requirements Document) a partir de ce brainstorming
2. **UX Expert** : Definir les wireframes et l'identite visuelle
3. **Architect** : Concevoir l'architecture technique
4. **PO** : Valider l'alignement des documents
5. **SM/Dev** : Commencer le developpement par la V1
