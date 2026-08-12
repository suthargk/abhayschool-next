"use client";

import { motion } from "framer-motion";

const CONFETTI_COLORS = ["#8371fa", "#c25ff9", "#df4fca", "#ed4492", "#f7b100"];
const CONFETTI_COUNT = 26;

function ConfettiPiece({ index }) {
  const left = (index * 61) % 100;
  const delay = (index % 13) * 0.4;
  const duration = 7 + (index % 5);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const width = 5 + (index % 3) * 2;

  return (
    <motion.span
      className="absolute top-0 rounded-sm"
      style={{ left: `${left}%`, width, height: width * 2.2, backgroundColor: color }}
      initial={{ y: "-10%", opacity: 0, rotate: 0 }}
      animate={{ y: "480px", opacity: [0, 1, 1, 0], rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function CelebrationBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden">
      <div className="absolute -left-24 -top-24 size-80 rounded-full bg-[#8371fa]/30 blur-3xl" />
      <div className="absolute -right-16 top-6 size-72 rounded-full bg-[#ed4492]/25 blur-3xl" />
      <div className="absolute left-1/3 top-52 size-64 rounded-full bg-[#f7b100]/20 blur-3xl" />

      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </div>
  );
}
