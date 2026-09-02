"use client";

import { useEffect, useState } from "react";

import { getSeenIds } from "@/lib/seen-storage";

/** Whether this browser has already opened `id` within `scope`. Resolves after mount (SSR-safe). */
export function useIsSeen(scope, id) {
  const [isSeen, setIsSeen] = useState(false);

  useEffect(() => {
    setIsSeen(getSeenIds(scope).includes(id));
  }, [scope, id]);

  return isSeen;
}
