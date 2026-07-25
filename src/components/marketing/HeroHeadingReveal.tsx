"use client";

import { motion, useReducedMotion } from "framer-motion";

// Word-by-word reveal for the Hero heading — each word clips up from
// behind an overflow-hidden mask, staggered left to right. Implements the
// "Word reveal" effect MOTION_SYSTEM.md calls for in the Hero spec.
export default function HeroHeadingReveal({
  words,
  startDelay = 0.15,
  wordDelay = 0.07,
}: {
  words: string[];
  startDelay?: number;
  wordDelay?: number;
}) {
  const reduceMotion = Boolean(useReducedMotion());

  if (reduceMotion) {
    return <>{words.join(" ")}</>;
  }

  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1 -mb-1 align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.55,
              delay: startDelay + i * wordDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}
