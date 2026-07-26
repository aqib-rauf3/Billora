"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

// Cursor-reactive aurora background for the Hero — the two brand-colored
// blobs drift a few pixels toward the cursor (spring-smoothed, GPU-only
// transform), the way Linear/Arc's hero backgrounds react to mouse
// movement. Falls back to static blobs for prefers-reduced-motion.
export default function HeroAurora() {
  const reduceMotion = Boolean(useReducedMotion());
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 20, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 20, mass: 0.5 });

  const xBlob1 = useTransform(springX, (v) => (reduceMotion ? 0 : v * 18));
  const yBlob1 = useTransform(springY, (v) => (reduceMotion ? 0 : v * 18));
  const xBlob2 = useTransform(springX, (v) => (reduceMotion ? 0 : v * -14));
  const yBlob2 = useTransform(springY, (v) => (reduceMotion ? 0 : v * -14));

  useEffect(() => {
    if (reduceMotion) return;
    const handleMove = (e: PointerEvent) => {
      mvX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mvY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reduceMotion, mvX, mvY]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Mesh gradient — several soft color stops that slowly drift, giving
          the background depth before the cursor-reactive blobs even move.
          Kept extremely subtle (low opacity) per BRAND_GUIDELINES.md
          "gradients should never overpower content". */}
      <motion.div
        aria-hidden
        className="absolute inset-[-10%] opacity-[0.5] dark:opacity-[0.35]"
        style={{
          background:
            "radial-gradient(38% 38% at 20% 22%, rgba(11,37,69,0.10), transparent 60%)," +
            "radial-gradient(34% 34% at 82% 18%, rgba(255,75,54,0.08), transparent 60%)," +
            "radial-gradient(40% 40% at 70% 82%, rgba(11,37,69,0.07), transparent 60%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 14, -8, 0], y: [0, -10, 6, 0], scale: [1, 1.03, 1.01, 1] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grain — a tiled SVG turbulence noise at very low opacity,
          the same trick used for the "luxurious" dark-mode texture
          BRAND_GUIDELINES.md calls for, applied here so the hero doesn't
          read as a flat vector gradient. */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        style={{ x: xBlob1, y: yBlob1 }}
        className="absolute top-[-15%] right-[5%] w-[420px] h-[420px] bg-navy/[0.07] dark:bg-navyLight/20 rounded-full blur-[110px]"
      />
      <motion.div
        style={{ x: xBlob2, y: yBlob2 }}
        className="absolute bottom-[-20%] left-[8%] w-[360px] h-[360px] bg-orange/[0.07] rounded-full blur-[110px]"
      />

      {/* Glass reflection — a faint diagonal highlight band across the top
          of the hero, like light catching a glass panel. */}
      <div
        className="absolute -top-1/2 left-[-20%] w-[140%] h-full rotate-[-8deg] opacity-[0.5] mix-blend-overlay"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 35%)",
        }}
      />
    </div>
  );
}
