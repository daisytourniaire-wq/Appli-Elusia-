import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Log léger des débuts de quiz, pour calculer un taux de complétion dans le
 * dashboard admin (leads / starts). Pas de PII : uniquement un session_id
 * généré côté client (localStorage) et les UTM.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const { sessionId, utm } = (body as Record<string, unknown>) ?? {};

  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return NextResponse.json({ error: "sessionId requis." }, { status: 400 });
  }

  const utmObj =
    typeof utm === "object" && utm !== null ? (utm as Record<string, unknown>) : {};
  const utmField = (key: string) =>
    typeof utmObj[key] === "string" ? (utmObj[key] as string).slice(0, 200) : null;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("quiz_events").insert({
    session_id: sessionId.slice(0, 200),
    event_type: "start",
    utm_source: utmField("source"),
  });

  if (error) {
    console.error("Erreur insertion quiz_events:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
