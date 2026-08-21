import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase "service_role" — bypass RLS. Ne doit JAMAIS être importé
 * depuis un composant client ni exposé au navigateur : utilisé uniquement
 * dans les routes API (app/api/**) côté serveur, après vérification de la
 * session admin le cas échéant.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
