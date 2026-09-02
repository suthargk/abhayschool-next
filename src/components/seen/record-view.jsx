"use client";

import { useEffect } from "react";

/** Invisible marker mounted on a detail page: records a unique-visitor view server-side. */
export function RecordView({ itemType, itemId }) {
  useEffect(() => {
    if (!itemId) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType, itemId }),
      keepalive: true,
    }).catch(() => {});
  }, [itemType, itemId]);

  return null;
}
