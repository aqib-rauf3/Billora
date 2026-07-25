"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// First-visit intro loader — Reference: uploaded reference video's opening
// orb (glowing sphere + wordmark + 0→100% counter, then dissolve into the
// page). Rebuilt with Billora's own logo mark and brand colors (navy/orange
// glow instead of the reference's neutral tone).
//
// Runs once per browser session (sessionStorage-gated) so repeat visits and
// in-app navigation are never slowed down, per MOTION_SYSTEM.md ("motion
// should never slow down the experience").
const SESSION_KEY = "billora-intro-seen";

export default function PageLoader() {
  const reduceMotion = Boolean(useReducedMotion());
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    if (reduceMotion) {
      sessionStorage.setItem(SESSION_KEY, "1");
      document.body.style.overflow = "";
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 1300;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => {
          document.body.style.overflow = "";
          setVisible(false);
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.4, ease: "easeInOut" } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,75,54,0.16), rgba(11,37,69,0.10) 55%, transparent 75%)",
              boxShadow: "0 0 60px rgba(11,37,69,0.12), inset 0 0 30px rgba(255,255,255,0.4)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-5 border-2 border-orange border-r-0" />
              <span className="text-lg font-medium text-ink tracking-[0.15em]">Billora</span>
            </div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 text-xs font-mono text-muted tabular-nums"
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
