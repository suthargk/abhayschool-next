"use client";

import { useEffect, useRef } from "react";

/**
 * After a pending filter navigation settles, nudge the gallery section back
 * into view only if the new (possibly much shorter) content left it
 * scrolled out of view — e.g. a filter with zero results shrank the page
 * and the browser clamped scroll position toward the bottom.
 */
export function useScrollAlbumsOnSettle(isPending) {
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending) {
      const el = document.getElementById("gallery-albums");
      if (el) {
        const rect = el.getBoundingClientRect();
        const outOfView = rect.bottom < 0 || rect.top > window.innerHeight;
        if (outOfView) {
          el.scrollIntoView({ block: "start" });
        }
      }
    }
    wasPending.current = isPending;
  }, [isPending]);
}
