"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Sticky stacked-card scroll — Reference: uploaded reference video (panels
// slide up from below and stack over the previous one as the page scrolls).
// Built with plain CSS `position: sticky` + increasing z-index per panel
// (no scroll-jacking library, no JS scroll hijacking — the browser's native
// scroll still drives everything, which keeps it accessible and cheap).
// The outgoing panel scales down, fades slightly, and tilts back on its
// bottom edge (rotateX) as it's covered — the perspective tilt reads much
// closer to Stripe's actual stacked-card depth than scale/opacity alone.
// `data-panel-id` on the outer (non-sticky) wrapper lets ScrollProgress
// track which panel currently owns the viewport center.
export default function StackedPanel({
  id,
  index,
  children,
  bg = "bg-bg",
  roundedTop = true,
  bufferVh = 22,
}: {
  id: string;
  index: number;
  children: ReactNode;
  bg?: string;
  roundedTop?: boolean;
  bufferVh?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -3]);

  return (
    <div
      ref={ref}
      data-panel-id={id}
      className="relative"
      style={{ paddingBottom: reduceMotion ? undefined : `${bufferVh}vh`, zIndex: index }}
    >
      <motion.section
        id={id}
        style={
          reduceMotion
            ? undefined
            : { scale, y, opacity, rotateX, transformPerspective: 1200, transformOrigin: "bottom center" }
        }
        className={[
          "sticky top-0 scroll-mt-20 min-h-screen flex flex-col",
          bg,
          roundedTop ? "rounded-t-[28px] md:rounded-t-[40px]" : "",
          roundedTop ? "shadow-[0_-12px_40px_-8px_rgba(11,37,69,0.12)]" : "",
          "overflow-hidden",
        ].join(" ")}
      >
        {children}
      </motion.section>
    </div>
  );
}
