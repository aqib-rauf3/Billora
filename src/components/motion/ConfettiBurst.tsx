"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Piece {
  id: number;
  x: number;
  rotate: number;
  color: string;
  delay: number;
  size: number;
}

const COLORS = ["#FF4B36", "#0B2545", "#2E7D46", "#E0A72E", "#5B7FDB"];

// Small confetti burst for success moments (e.g. the contact form). Pure
// transform/opacity animation (GPU-only), fires once and unmounts itself —
// the parent controls visibility by conditionally rendering this. Skipped
// for prefers-reduced-motion.
export default function ConfettiBurst({ count = 18 }: { count?: number }) {
  const reduceMotion = Boolean(useReducedMotion());

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 220,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.15,
        size: 5 + Math.random() * 4,
      })),
    [count]
  );

  if (reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-visible">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size * 0.6, background: p.color, top: 0, left: "50%" }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: 140 + Math.random() * 60,
            rotate: p.rotate,
          }}
          transition={{ duration: 1.1, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
