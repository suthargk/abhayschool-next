import { createClient } from "@supabase/supabase-js";

import { prisma } from "@/lib/prisma";

let client = null;

/**
 * Service-role Supabase client for server-only admin operations — creating
 * and pre-confirming teacher Auth accounts ourselves so we don't depend on
 * Supabase's own (unreliable/non-customizable via the free shared sender)
 * confirmation email. Never import this from a Client Component or expose
 * SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured (SUPABASE_SERVICE_ROLE_KEY)");
  }

  client = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

/** auth.users lives in a different Postgres schema than our Prisma models,
 * but it's the same database — a direct query is the reliable way to find an
 * existing Auth user by email (the Admin SDK has no email filter). */
export async function findAuthUserIdByEmail(email) {
  const rows = await prisma.$queryRaw`SELECT id::text AS id FROM auth.users WHERE email = ${email} LIMIT 1`;
  return rows[0]?.id ?? null;
}
