import { useEffect, useState } from "react";

// Character-by-character reveal, restartable via the `resetKey` dependency
// (the Hero invoice mockup loops its whole sequence every 7s, so each loop
// needs the typing to restart from empty). Respects prefers-reduced-motion
// by rendering the full text immediately instead of animating it.
export function useTypewriter(
  text: string,
  active: boolean,
  resetKey: number | string,
  speed = 22,
  reduceMotion = false
) {
  const [shown, setShown] = useState(reduceMotion ? text : "");

  useEffect(() => {
    if (reduceMotion) {
      setShown(text);
      return;
    }
    if (!active) {
      setShown("");
      return;
    }
    let i = 0;
    setShown("");
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, resetKey, text, reduceMotion]);

  return shown;
}
