import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LIFESTYLE_QUESTIONS } from "@/lib/quiz/questions";
import { CONCERN_OPTIONS } from "@/lib/quiz/questions";
import { computeQuizResult, isQuizComplete } from "@/lib/quiz/scoring";
import type { ConcernKey } from "@/lib/quiz/types";

const CONCERN_KEYS = new Set(CONCERN_OPTIONS.map((c) => c.key));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const {
    firstName,
    email,
    concern,
    answers,
    consent,
    sessionId,
    utm,
  } = body as Record<string, unknown>;

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (typeof concern !== "string" || !CONCERN_KEYS.has(concern as ConcernKey)) {
    return NextResponse.json({ error: "Préoccupation invalide." }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json(
      { error: "Le consentement est requis." },
      { status: 400 }
    );
  }
  if (typeof answers !== "object" || answers === null) {
    return NextResponse.json({ error: "Réponses manquantes." }, { status: 400 });
  }

  const cleanAnswers: Record<string, number> = {};
  for (const q of LIFESTYLE_QUESTIONS) {
    const raw = (answers as Record<string, unknown>)[q.id];
    if (typeof raw !== "number" || raw < 0 || raw >= q.options.length) {
      return NextResponse.json(
        { error: `Réponse manquante ou invalide pour "${q.id}".` },
        { status: 400 }
      );
    }
    cleanAnswers[q.id] = raw;
  }

  if (!isQuizComplete(concern, cleanAnswers)) {
    return NextResponse.json({ error: "Quiz incomplet." }, { status: 400 });
  }

  const result = computeQuizResult(concern as ConcernKey, cleanAnswers);

  const axisScoresRecord = Object.fromEntries(
    result.axisScores.map((s) => [s.axis, { raw: s.raw, percent: s.percent }])
  );

  const utmObj =
    typeof utm === "object" && utm !== null ? (utm as Record<string, unknown>) : {};
  const utmField = (key: string) =>
    typeof utmObj[key] === "string" ? (utmObj[key] as string).slice(0, 200) : null;

  const supabase = createSupabaseAdminClient();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      first_name: typeof firstName === "string" ? firstName.slice(0, 200) : null,
      email,
      concern,
      profile_title: result.profileTitle,
      priorities: result.priorities,
      axis_scores: axisScoresRecord,
      consent: true,
      session_id: typeof sessionId === "string" ? sessionId.slice(0, 200) : null,
      utm_source: utmField("source"),
      utm_medium: utmField("medium"),
      utm_campaign: utmField("campaign"),
      utm_content: utmField("content"),
      utm_term: utmField("term"),
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    console.error("Erreur insertion lead:", leadError);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le lead." },
      { status: 500 }
    );
  }

  const responsesRows = LIFESTYLE_QUESTIONS.map((q) => ({
    lead_id: lead.id,
    question_id: q.id,
    axis: q.axis,
    answer_value: cleanAnswers[q.id],
  }));

  const { error: responsesError } = await supabase
    .from("quiz_responses")
    .insert(responsesRows);

  if (responsesError) {
    console.error("Erreur insertion quiz_responses:", responsesError);
  }

  return NextResponse.json({
    id: lead.id,
    profileTitle: result.profileTitle,
    priorities: result.priorities,
    axisScores: result.axisScores,
  });
}
