-- Élusia MVP — schéma initial
-- À exécuter dans l'éditeur SQL Supabase (ou via `supabase db push`).

create extension if not exists "pgcrypto";

-- Table des leads capturés à l'issue du quiz.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text,
  email text not null,
  concern text not null,
  profile_title text not null,
  priorities text[] not null,
  axis_scores jsonb not null,
  consent boolean not null default false,
  session_id text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_concern_idx on public.leads (concern);

-- Détail des réponses au quiz, pour analyse fine du comportement.
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  question_id text not null,
  axis text not null,
  answer_value smallint not null
);

create index if not exists quiz_responses_lead_id_idx on public.quiz_responses (lead_id);

-- Événements légers de funnel (démarrage du quiz), pour calculer un taux
-- de complétion dans le dashboard admin. Pas de donnée personnelle.
create table if not exists public.quiz_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  event_type text not null,
  utm_source text
);

create index if not exists quiz_events_created_at_idx on public.quiz_events (created_at desc);

-- RLS : ces tables ne sont écrites/lues que via la clé service_role côté
-- serveur (routes /api/**), jamais directement depuis le navigateur.
-- On active RLS sans policy pour bloquer tout accès via la clé anon.
alter table public.leads enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.quiz_events enable row level security;
