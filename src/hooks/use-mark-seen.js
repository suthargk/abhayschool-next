"use client";

import { useEffect } from "react";

import { markSeen } from "@/lib/seen-storage";

/** Records that this browser has opened `id` within `scope`, once on mount. */
export function useMarkSeen(scope, id) {
  useEffect(() => {
    markSeen(scope, id);
  }, [scope, id]);
}
