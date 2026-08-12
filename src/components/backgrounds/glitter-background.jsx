"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const BLOB_PRESETS = {
  violet: ["#8371fa", "#c25ff9", "#f7b100"],
  festive: ["#df4fca", "#ed4492", "#f7b100"],
};

const SPARKLE_COLORS = ["#f7b100", "#c25ff9", "#ed4492", "#8371fa"];

function Sparkle({ index }) {
  const left = (index * 37) % 100;
  const top = (index * 53) % 100;
  const size = 3 + (index % 3) * 2;
  const delay = (index % 9) * 0.3;
  const duration = 2.2 + (index % 4) * 0.6;
  const color = SPARKLE_COLORS[index % SPARKLE_COLORS.length];

  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function GlitterBackground({
  preset = "violet",
  sparkleCount = 16,
  className,
}) {
  const blobColors = BLOB_PRESETS[preset] ?? BLOB_PRESETS.violet;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      <div
        className="absolute left-4 top-4 size-48 rounded-full opacity-25 blur-3xl sm:size-64"
        style={{ backgroundColor: blobColors[0] }}
      />
      <div
        className="absolute right-4 top-10 size-40 rounded-full opacity-20 blur-3xl sm:size-56"
        style={{ backgroundColor: blobColors[1] }}
      />
      <div
        className="absolute bottom-4 left-1/3 size-36 rounded-full opacity-15 blur-3xl sm:size-48"
        style={{ backgroundColor: blobColors[2] }}
      />

      {Array.from({ length: sparkleCount }).map((_, i) => (
        <Sparkle key={i} index={i} />
      ))}
    </div>
  );
}
