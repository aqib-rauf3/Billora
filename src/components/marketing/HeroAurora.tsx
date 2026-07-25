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
      <motion.div
        style={{ x: xBlob1, y: yBlob1 }}
        className="absolute top-[-15%] right-[5%] w-[420px] h-[420px] bg-navy/[0.07] dark:bg-navyLight/20 rounded-full blur-[110px]"
      />
      <motion.div
        style={{ x: xBlob2, y: yBlob2 }}
        className="absolute bottom-[-20%] left-[8%] w-[360px] h-[360px] bg-orange/[0.07] rounded-full blur-[110px]"
      />
    </div>
  );
}
