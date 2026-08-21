import { createBrowserClient } from "@supabase/ssr";

/** Client Supabase côté navigateur — utilisé uniquement pour l'auth admin. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
