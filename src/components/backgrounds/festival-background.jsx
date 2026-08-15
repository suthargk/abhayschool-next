"use client";

import { useMemo } from "react";

import { getActiveFestival } from "@/lib/festival";

import { GlitterBackground } from "./glitter-background";

export function FestivalBackground() {
  const festival = useMemo(() => getActiveFestival(), []);

  if (!festival) return null;

  return (
    <GlitterBackground
      colors={festival.blobColors}
      sparkleColors={festival.sparkleColors}
      sparkleCount={14}
      className="fixed inset-0 -z-50 opacity-70"
    />
  );
}
