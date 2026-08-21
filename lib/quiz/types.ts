export type AxisKey =
  | "glycemic"
  | "antioxidants"
  | "fats"
  | "hydration"
  | "sleep"
  | "stress"
  | "activity";

export type ConcernKey =
  | "taches_pigmentaires"
  | "acne_adulte"
  | "teint_terne"
  | "texture_pores"
  | "perte_fermete";

export interface QuizOption {
  label: string;
  value: number; // points de risque, 0 (optimal) à 3 (à risque)
}

export interface LifestyleQuestion {
  id: string;
  axis: AxisKey;
  question: string;
  options: QuizOption[];
}

export interface ConcernOption {
  key: ConcernKey;
  label: string;
}

export interface AxisScore {
  axis: AxisKey;
  /** Moyenne brute des points de risque, 0 à 3 */
  raw: number;
  /** Score normalisé 0 à 100, plus haut = axe plus prioritaire */
  percent: number;
}

export interface QuizResult {
  concern: ConcernKey;
  axisScores: AxisScore[];
  priorities: AxisKey[]; // 3 axes les plus prioritaires, du plus au moins urgent
  profileTitle: string;
}
