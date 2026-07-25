"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Magnetic hover CTA — the button drifts a few px toward the cursor while
// hovered, spring-settles back to rest on leave. Subtle by design (max
// ~0.25 of cursor offset) so it reads as "premium responsiveness" rather
// than a gimmick. Disabled entirely for prefers-reduced-motion.
export default function MagneticButton({
  href,
  children,
  className = "",
  strength = 0.25,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduceMotion = Boolean(useReducedMotion());

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.3 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
