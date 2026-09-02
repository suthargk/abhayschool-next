"use client";

import { useMarkSeen } from "@/hooks/use-mark-seen";

/** Invisible marker mounted on a detail page to record that this browser opened `id`. */
export function MarkSeen({ scope, id }) {
  useMarkSeen(scope, id);
  return null;
}
