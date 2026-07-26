"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Slow-drifting ambient particles for the Hero, layered under the content
// (low z-index) and above HeroAurora's glow blobs. Pure CSS-driven
// transform animation (no per-frame JS), so it stays cheap even with a
// couple dozen on screen. Skipped entirely for prefers-reduced-motion.
export default function ParticleField({ count = 22 }: { count?: number }) {
  const reduceMotion = Boolean(useReducedMotion());

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 14 + Math.random() * 12,
        delay: Math.random() * -20,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [count]
  );

  if (reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-orange"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            bottom: -20,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -420], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
