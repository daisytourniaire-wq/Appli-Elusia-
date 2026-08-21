import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CONCERN_META, AXIS_META } from "@/lib/quiz/content";
import type { AxisKey, ConcernKey } from "@/lib/quiz/types";
import { LogoutButton } from "@/components/LogoutButton";
import { StatCard } from "@/components/StatCard";

export const dynamic = "force-dynamic";

interface LeadRow {
  id: string;
  created_at: string;
  first_name: string | null;
  email: string;
  concern: string;
  profile_title: string;
  priorities: string[];
  utm_source: string | null;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export default async function AdminDashboardPage() {
  const supabase = createSupabaseAdminClient();
  const since30 = daysAgo(30);

  const [{ data: leads, count: totalLeads }, { count: startsLast30 }] =
    await Promise.all([
      supabase
        .from("leads")
        .select(
          "id, created_at, first_name, email, concern, profile_title, priorities, utm_source",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("quiz_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "start")
        .gte("created_at", since30),
    ]);

  const rows = (leads ?? []) as LeadRow[];
  const leadsLast30 = rows.filter((r) => r.created_at >= since30).length;
  const completionRate =
    startsLast30 && startsLast30 > 0
      ? Math.round((leadsLast30 / startsLast30) * 100)
      : null;

  const concernCounts = new Map<string, number>();
  const axisCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();

  for (const row of rows) {
    concernCounts.set(row.concern, (concernCounts.get(row.concern) ?? 0) + 1);
    const topAxis = row.priorities?.[0];
    if (topAxis) {
      axisCounts.set(topAxis, (axisCounts.get(topAxis) ?? 0) + 1);
    }
    const source = row.utm_source ?? "Direct / inconnu";
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }

  const sortedConcerns = [...concernCounts.entries()].sort((a, b) => b[1] - a[1]);
  const sortedAxes = [...axisCounts.entries()].sort((a, b) => b[1] - a[1]);
  const sortedSources = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-elusia-bg px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl italic text-elusia-ink">
            Dashboard Élusia
          </h1>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Leads (total)" value={String(totalLeads ?? rows.length)} />
          <StatCard label="Leads (30j)" value={String(leadsLast30)} />
          <StatCard label="Démarrages quiz (30j)" value={String(startsLast30 ?? 0)} />
          <StatCard
            label="Taux de complétion (30j)"
            value={completionRate === null ? "—" : `${completionRate}%`}
            hint="Leads / démarrages de quiz"
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="card">
            <h2 className="font-serif text-lg text-elusia-ink">
              Préoccupations principales
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {sortedConcerns.map(([key, count]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-elusia-muted">
                    {CONCERN_META[key as ConcernKey]?.label ?? key}
                  </span>
                  <span className="font-medium text-elusia-ink">{count}</span>
                </li>
              ))}
              {sortedConcerns.length === 0 && (
                <li className="text-elusia-muted">Aucune donnée pour l&apos;instant.</li>
              )}
            </ul>
          </div>

          <div className="card">
            <h2 className="font-serif text-lg text-elusia-ink">
              Axes prioritaires (n°1)
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {sortedAxes.map(([key, count]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-elusia-muted">
                    {AXIS_META[key as AxisKey]?.short ?? key}
                  </span>
                  <span className="font-medium text-elusia-ink">{count}</span>
                </li>
              ))}
              {sortedAxes.length === 0 && (
                <li className="text-elusia-muted">Aucune donnée pour l&apos;instant.</li>
              )}
            </ul>
          </div>

          <div className="card">
            <h2 className="font-serif text-lg text-elusia-ink">Sources de trafic</h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {sortedSources.map(([key, count]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-elusia-muted">{key}</span>
                  <span className="font-medium text-elusia-ink">{count}</span>
                </li>
              ))}
              {sortedSources.length === 0 && (
                <li className="text-elusia-muted">Aucune donnée pour l&apos;instant.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="card mt-8 overflow-x-auto">
          <h2 className="font-serif text-lg text-elusia-ink">
            Leads récents ({Math.min(rows.length, 50)})
          </h2>
          <table className="mt-4 w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-elusia-line text-xs uppercase tracking-wide text-elusia-muted">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Prénom</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Préoccupation</th>
                <th className="py-2 pr-4">Profil</th>
                <th className="py-2 pr-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((row) => (
                <tr key={row.id} className="border-b border-elusia-line/60">
                  <td className="py-2 pr-4 text-elusia-muted">
                    {new Date(row.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-2 pr-4">{row.first_name ?? "—"}</td>
                  <td className="py-2 pr-4">{row.email}</td>
                  <td className="py-2 pr-4">
                    {CONCERN_META[row.concern as ConcernKey]?.label ?? row.concern}
                  </td>
                  <td className="py-2 pr-4">{row.profile_title}</td>
                  <td className="py-2 pr-4">{row.utm_source ?? "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-elusia-muted">
                    Aucun lead pour l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
