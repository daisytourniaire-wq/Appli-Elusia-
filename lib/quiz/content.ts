import type { AxisKey, ConcernKey } from "./types";

export const AXIS_META: Record<
  AxisKey,
  { label: string; short: string; action: string }
> = {
  glycemic: {
    label: "Équilibre glycémique",
    short: "Sucre & index glycémique",
    action:
      "Limite les pics de sucre : privilégie les index glycémiques bas et associe toujours un sucre à une source de fibres ou de protéines.",
  },
  antioxidants: {
    label: "Antioxydants & qualité de l'alimentation",
    short: "Fruits, légumes & antioxydants",
    action:
      "Ajoute une portion de fruits ou légumes colorés à chaque repas pour augmenter ton apport en antioxydants naturels.",
  },
  fats: {
    label: "Bonnes graisses / oméga-3",
    short: "Oméga-3 & lipides de qualité",
    action:
      "Intègre une source d'oméga-3 au moins 2 à 3 fois par semaine (poisson gras, noix, graines de lin ou de chia).",
  },
  hydration: {
    label: "Hydratation",
    short: "Eau & hydratation",
    action:
      "Vise 1,5 L d'eau par jour, répartis sur la journée plutôt qu'en une seule fois.",
  },
  sleep: {
    label: "Sommeil",
    short: "Qualité et durée du sommeil",
    action:
      "Fixe-toi une heure de coucher régulière et coupe les écrans 30 minutes avant de dormir pour un sommeil plus réparateur.",
  },
  stress: {
    label: "Gestion du stress",
    short: "Stress quotidien",
    action:
      "Réserve 5 à 10 minutes par jour à une pause consciente (respiration, marche, méditation) pour faire retomber la pression.",
  },
  activity: {
    label: "Activité physique",
    short: "Mouvement & activité physique",
    action:
      "Ajoute 20 à 30 minutes de marche active ou de mouvement à ta journée, même fractionnées.",
  },
};

export const CONCERN_META: Record<
  ConcernKey,
  { label: string; profileBase: string; description: string }
> = {
  taches_pigmentaires: {
    label: "Taches pigmentaires",
    profileBase: "Éclat Irrégulier",
    description:
      "Ta peau montre des zones de pigmentation inégale. L'alimentation et le stress oxydatif jouent un rôle clé dans leur intensité.",
  },
  acne_adulte: {
    label: "Boutons / acné adulte",
    profileBase: "Peau Réactive",
    description:
      "Ta peau réagit par des imperfections. L'équilibre glycémique et l'inflammation liée au mode de vie sont souvent en cause.",
  },
  teint_terne: {
    label: "Teint terne",
    profileBase: "Éclat en Berne",
    description:
      "Ton teint manque de lumière. C'est souvent le signe d'un renouvellement cellulaire ralenti par le sommeil, le stress ou l'alimentation.",
  },
  texture_pores: {
    label: "Texture irrégulière, pores visibles",
    profileBase: "Texture Fragile",
    description:
      "Ta peau manque d'uniformité. La qualité de l'alimentation et l'hydratation influencent directement le grain de peau.",
  },
  perte_fermete: {
    label: "Perte de fermeté",
    profileBase: "Fermeté en Baisse",
    description:
      "Ta peau a besoin de soutien structurel. Les bonnes graisses, les antioxydants et le sommeil sont essentiels au collagène.",
  },
};

export function buildProfileTitle(concern: ConcernKey): string {
  return `Profil ${CONCERN_META[concern].profileBase}`;
}
