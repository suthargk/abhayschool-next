import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * Current dashboard user's profile (role, email), or null if unauthenticated
 * or not provisioned with a Profile row. Server-only.
 *
 * Wrapped in React's cache() so the layout and page calling this within the
 * same request (e.g. a full page load) share one Supabase + DB round trip
 * instead of each paying for it separately.
 */
export const getCurrentProfile = cache(async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) return null;

  return { ...profile, email: user.email };
});

/**
 * Throws a Response-friendly error if the current user isn't authenticated
 * with one of the given roles. Use in Route Handlers / Server Actions.
 */
export async function requireRole(roles) {
  const profile = await getCurrentProfile();
  if (!profile || !roles.includes(profile.role)) {
    const error = new Error("Forbidden");
    error.status = profile ? 403 : 401;
    throw error;
  }
  // Self-signed-up teacher accounts need admin approval before they can use
  // any TEACHER-gated route; ADMIN/EDITOR profiles are always ACTIVE.
  if (profile.role === "TEACHER" && profile.status !== "ACTIVE") {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
  return profile;
}
