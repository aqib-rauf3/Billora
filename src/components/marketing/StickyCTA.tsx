"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Sticky bottom bar, shown once the visitor has scrolled past the Hero and
// hidden again once they reach the Footer (so it never overlaps the real
// footer CTA). Pure scroll-position state, no layout thrash — reads
// window.scrollY on a rAF-throttled listener.
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const heroEl = document.getElementById("hero");
      const footerEl = document.querySelector("footer");
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      const footerTop = footerEl ? footerEl.getBoundingClientRect().top : Infinity;
      setVisible(heroBottom < 0 && footerTop > window.innerHeight);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-md md:hidden"
        >
          <a
            href="/login"
            className="flex items-center justify-center gap-2 bg-navy text-white rounded-full px-6 py-3 text-sm font-medium shadow-[0_8px_28px_-6px_rgba(11,37,69,0.5)] backdrop-blur"
          >
            Start Free — No Card Required
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
