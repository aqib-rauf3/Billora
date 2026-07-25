"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

// Renders a stat value ("2 min", "100%", "3", "PDF") and, when the leading
// part is numeric, counts it up once the card scrolls into view — reusing
// the same easing/hook as the Hero invoice mockup's total for consistency.
// Non-numeric values (e.g. "PDF") just render as-is.
export default function AnimatedStatValue({ raw }: { raw: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = Boolean(useReducedMotion());

  const match = raw.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const value = useCountUp(target, inView && Boolean(match), reduceMotion);

  if (!match) {
    return (
      <p ref={ref} className="text-2xl font-medium text-ink">
        {raw}
      </p>
    );
  }

  return (
    <p ref={ref} className="text-2xl font-medium text-ink">
      {Math.round(value)}
      {match[2]}
    </p>
  );
}
