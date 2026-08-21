import type { ConcernOption, LifestyleQuestion } from "./types";

export const CONCERN_OPTIONS: ConcernOption[] = [
  { key: "taches_pigmentaires", label: "Taches pigmentaires" },
  { key: "acne_adulte", label: "Boutons / acné adulte" },
  { key: "teint_terne", label: "Teint terne, manque d'éclat" },
  { key: "texture_pores", label: "Texture irrégulière, pores visibles" },
  { key: "perte_fermete", label: "Perte de fermeté" },
];

const freq4 = (labels: [string, string, string, string]): LifestyleQuestion["options"] =>
  labels.map((label, i) => ({ label, value: i }));

export const LIFESTYLE_QUESTIONS: LifestyleQuestion[] = [
  {
    id: "sucre_transforme",
    axis: "glycemic",
    question:
      "À quelle fréquence consommes-tu des produits sucrés ou ultra-transformés (viennoiseries, sodas, plats préparés, snacks industriels) ?",
    options: freq4([
      "Rarement ou jamais",
      "Quelques fois par semaine",
      "Presque tous les jours",
      "Plusieurs fois par jour",
    ]),
  },
  {
    id: "fruits_legumes",
    axis: "antioxidants",
    question: "Combien de portions de fruits et légumes manges-tu par jour, en moyenne ?",
    options: freq4([
      "5 portions ou plus",
      "3 à 4 portions",
      "1 à 2 portions",
      "Quasiment aucune",
    ]),
  },
  {
    id: "omega3",
    axis: "fats",
    question:
      "À quelle fréquence consommes-tu des sources d'oméga-3 (poissons gras, noix, graines de lin ou de chia, huile de colza/noix) ?",
    options: freq4([
      "Plusieurs fois par semaine",
      "Une fois par semaine",
      "Rarement",
      "Jamais",
    ]),
  },
  {
    id: "hydratation",
    axis: "hydration",
    question: "Combien d'eau bois-tu en moyenne par jour ?",
    options: freq4([
      "1,5 litre ou plus",
      "Environ 1 litre",
      "Environ 0,5 litre",
      "Moins de 0,5 litre / je ne sais pas",
    ]),
  },
  {
    id: "sommeil_duree",
    axis: "sleep",
    question: "Combien d'heures dors-tu en moyenne par nuit ?",
    options: freq4(["7 à 9 heures", "6 à 7 heures", "5 à 6 heures", "Moins de 5 heures"]),
  },
  {
    id: "sommeil_qualite",
    axis: "sleep",
    question: "Comment qualifierais-tu la qualité de ton sommeil ?",
    options: freq4([
      "Réparateur, je me réveille en forme",
      "Correct mais perfectible",
      "Sommeil léger, réveils fréquents",
      "Je me sens fatiguée au réveil",
    ]),
  },
  {
    id: "stress_niveau",
    axis: "stress",
    question: "Comment évaluerais-tu ton niveau de stress au quotidien ?",
    options: freq4([
      "Faible, je me sens plutôt sereine",
      "Modéré",
      "Élevé la plupart du temps",
      "Très élevé, je me sens souvent débordée",
    ]),
  },
  {
    id: "stress_gestion",
    axis: "stress",
    question:
      "As-tu des moments dans la journée pour décompresser (respiration, pause, marche, méditation) ?",
    options: freq4(["Oui, régulièrement", "Parfois", "Rarement", "Jamais"]),
  },
  {
    id: "activite_physique",
    axis: "activity",
    question:
      "À quelle fréquence pratiques-tu une activité physique, même modérée (marche rapide, sport, yoga) ?",
    options: freq4([
      "Presque tous les jours",
      "2 à 3 fois par semaine",
      "Une fois par semaine",
      "Quasiment jamais",
    ]),
  },
];
