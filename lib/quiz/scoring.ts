import { LIFESTYLE_QUESTIONS } from "./questions";
import type { AxisKey, AxisScore, ConcernKey, QuizResult } from "./types";
import { buildProfileTitle } from "./content";

const MAX_RAW = 3;

/**
 * Calcule un score par axe (moyenne des points de risque des questions liées
 * à cet axe), puis dérive les 3 axes prioritaires (les scores les plus
 * élevés = les habitudes les plus éloignées de l'optimal).
 *
 * Déterministe et transparent : aucune pondération cachée, aucun aléatoire.
 */
export function computeQuizResult(
  concern: ConcernKey,
  answers: Record<string, number>
): QuizResult {
  const totals = new Map<AxisKey, { sum: number; count: number }>();

  for (const q of LIFESTYLE_QUESTIONS) {
    const value = answers[q.id];
    if (typeof value !== "number") continue;
    const entry = totals.get(q.axis) ?? { sum: 0, count: 0 };
    entry.sum += value;
    entry.count += 1;
    totals.set(q.axis, entry);
  }

  const axisScores: AxisScore[] = Array.from(totals.entries()).map(
    ([axis, { sum, count }]) => {
      const raw = count > 0 ? sum / count : 0;
      return {
        axis,
        raw,
        percent: Math.round((raw / MAX_RAW) * 100),
      };
    }
  );

  const priorities = [...axisScores]
    .sort((a, b) => b.raw - a.raw)
    .slice(0, 3)
    .map((s) => s.axis);

  return {
    concern,
    axisScores,
    priorities,
    profileTitle: buildProfileTitle(concern),
  };
}

export function isQuizComplete(
  concern: string | null,
  answers: Record<string, number>
): boolean {
  if (!concern) return false;
  return LIFESTYLE_QUESTIONS.every((q) => typeof answers[q.id] === "number");
}
