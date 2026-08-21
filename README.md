# Élusia — MVP

Application MVP pour **Élusia** (Food Skincare — *« La beauté commence aussi
dans ton assiette »*) : quiz de diagnostic peau/alimentation/mode de vie,
scoring déterministe, capture de lead, page de résultat personnalisée, et
dashboard admin.

Stack : Next.js 14 (App Router, TypeScript) + Tailwind CSS + Supabase
(Postgres + Auth).

## Le parcours

1. **Landing** (`/`) — présentation d'Élusia, CTA vers le quiz.
2. **Quiz** (`/quiz`) — 10 questions :
   - la préoccupation peau principale (taches pigmentaires, acné adulte,
     teint terne, texture/pores, perte de fermeté) ;
   - 9 questions de mode de vie réparties sur 7 axes : équilibre glycémique,
     antioxydants, bonnes graisses/oméga-3, hydratation, sommeil, stress,
     activité physique.
3. **Scoring** (`lib/quiz/scoring.ts`) — déterministe et transparent : chaque
   réponse ajoute des points de risque (0 à 3) sur son axe ; les scores par
   axe sont la moyenne des réponses liées ; les **3 axes avec le score le
   plus élevé** deviennent les priorités affichées. Aucune IA, aucun aléa.
4. **Capture du lead** — prénom, email, consentement RGPD, avant
   d'afficher le résultat.
5. **Résultat** — profil Élusia personnalisé, 3 axes prioritaires (avec
   barres de score) et 3 actions concrètes associées.
6. **Admin** (`/admin/login` puis `/admin/dashboard`, protégé par Supabase
   Auth) — liste des leads, taux de complétion du quiz (leads / démarrages
   sur 30 jours), répartition par préoccupation, par axe prioritaire n°1, et
   par source de trafic (UTM).

## Modèle de données (Supabase)

Voir `supabase/migrations/0001_init.sql` :

- `leads` — prénom, email, préoccupation, profil, priorités (3 axes),
  scores par axe (jsonb), consentement, UTM, date.
- `quiz_responses` — détail des réponses par question, pour analyse fine.
- `quiz_events` — démarrages de quiz (funnel), sans donnée personnelle.

Ces trois tables ont RLS activé sans policy : elles ne sont accessibles que
via la clé `service_role`, utilisée uniquement côté serveur (`app/api/**`,
`app/admin/dashboard`). Le navigateur n'a jamais accès direct aux données.

## Lancer le projet en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés Supabase
npm run dev
```

### Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL, exécuter `supabase/migrations/0001_init.sql`.
3. Renseigner dans `.env.local` : `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Créer un utilisateur (Authentication → Users) pour se connecter à
   `/admin/login` : c'est le compte admin du dashboard.

## Scripts

- `npm run dev` — serveur de développement.
- `npm run build` / `npm run start` — build et exécution en production.
- `npm run lint` — ESLint (Next.js).
- `npm run typecheck` — vérification TypeScript.

## Prochaines étapes (hors MVP)

- Connexion à un outil emailing (Brevo ou équivalent) pour l'envoi du
  profil et le nurturing par préoccupation.
- Design system définitif (identité visuelle complète d'Élusia).
- Suivi de conversion plus fin (clics landing → démarrage quiz).
