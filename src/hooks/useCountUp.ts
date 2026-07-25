"use client";

import { useEffect, useState } from "react";

// Shared count-up animation, used by the hero invoice mockup and the
// StatsStrip numbers. `active` is the external trigger (loop cycle or
// scroll-into-view); resets to 0 whenever it goes false so re-triggering
// (e.g. scrolling a stat back into view) replays the count.
export function useCountUp(target: number, active: boolean, reduceMotion: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduceMotion]);

  return value;
}
