"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

// Custom cursor for desktop pointer devices only — a small dot with a
// trailing ring, spring-smoothed. Scales up and goes hollow over anything
// clickable (a, button, [role=button], input, select, textarea) so it
// reads as a hover state rather than decoration. Never renders on touch
// devices (no mouse to replace) or for prefers-reduced-motion.
export default function CustomCursor() {
  const reduceMotion = Boolean(useReducedMotion());
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 200, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 200, damping: 26, mass: 0.6 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFinePointer && !reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("custom-cursor-active");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [role='button'], input, select, textarea, label")));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200] rounded-full bg-orange"
        style={{
          x: springX,
          y: springY,
          width: 7,
          height: 7,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200] rounded-full border border-orange"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? (hovering ? 0.9 : 0.55) : 0,
        }}
        animate={{ width: hovering ? 44 : 26, height: hovering ? 44 : 26 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
