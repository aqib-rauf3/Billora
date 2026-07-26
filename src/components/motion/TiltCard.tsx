"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

// Subtle 3D tilt + a glass reflection sweep, for the hero invoice card and
// similar "hero product" surfaces. Tilt follows the cursor position within
// the card bounds (spring-smoothed, GPU-only transform); the reflection is
// a diagonal light band that moves across the card's diagonal on hover,
// like light catching glass. Disabled entirely for prefers-reduced-motion
// and on touch (no mouse to react to).
export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 220, damping: 22, mass: 0.4 });
  const springY = useSpring(mvY, { stiffness: 220, damping: 22, mass: 0.4 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(
    [springX, springY],
    ([x, y]: number[]) => Math.min(1, Math.hypot(x, y) * 1.6 + 0.12)
  );

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }
      }
      className={`relative ${className}`}
    >
      {children}

      {/* Glass reflection sweep — a soft diagonal highlight that tracks the
          cursor, clipped to the card's rounded corners. */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
          style={{ opacity: glareOpacity }}
        >
          <motion.div
            className="absolute inset-[-40%]"
            style={{
              left: glareX,
              top: glareY,
              translateX: "-50%",
              translateY: "-50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)",
              width: "70%",
              height: "70%",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
