"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconStarFilled, IconBuildingSkyscraper, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";

// Fictional reviews for fictional sample businesses (same names used across
// mockData.ts / LogoCloud) — no real person or company is quoted or
// attributed, consistent with Claude's guidance on not fabricating quotes
// from real people. For the same reason there's no "Verified" badge here:
// that would claim a real verification that never happened for content
// that's openly a placeholder. The small building icon next to each role
// is purely decorative, not a claim of any kind.
const REVIEWS = [
  {
    name: "S. Kamran",
    role: "Founder, Coral Studio",
    quote:
      "I used to spend an evening every month just formatting invoices. Now I type three words and Billora hands me something client-ready.",
  },
  {
    name: "A. Fatima",
    role: "Ops lead, Devko Traders",
    quote:
      "The estimate-to-invoice flow alone paid for the subscription in the first week. Our clients notice the difference too.",
  },
  {
    name: "R. Sheikh",
    role: "Independent consultant",
    quote:
      "Simple, fast, and doesn't try to be everything. It's the first invoicing tool that actually feels premium.",
  },
];

const AUTOPLAY_MS = 5500;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  const go = (next: number) => {
    setDirection(next > index || (index === REVIEWS.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + REVIEWS.length) % REVIEWS.length);
  };

  const r = REVIEWS[index];

  return (
    <section className="px-7 py-16 max-w-3xl mx-auto">
      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-1.5">
          Loved by freelancers and small teams
        </p>
        <h2 className="text-xl md:text-2xl font-medium text-ink text-center mb-10">
          What people are saying
        </h2>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={r.name}
                custom={direction}
                initial={reduceMotion ? false : { opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24, transition: { duration: 0.2 } }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="bg-surface border border-border rounded-xl p-7 md:p-8 flex flex-col items-center text-center"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <IconStarFilled key={s} size={14} className="text-orange" />
                  ))}
                </div>
                <p className="text-base text-text leading-relaxed mb-6 max-w-lg">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-navy text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {initials(r.name)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-ink">{r.name}</p>
                    <p className="text-[11px] text-muted flex items-center gap-1">
                      <IconBuildingSkyscraper size={11} className="opacity-70" />
                      {r.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev/next — desktop, subtle */}
          <button
            aria-label="Previous testimonial"
            onClick={() => go(index - 1)}
            className="hidden md:flex absolute top-1/2 -left-12 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-ink hover:border-[#C7D2F0] dark:hover:border-[#2A3555] transition-colors"
          >
            <IconChevronLeft size={16} />
          </button>
          <button
            aria-label="Next testimonial"
            onClick={() => go(index + 1)}
            className="hidden md:flex absolute top-1/2 -right-12 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-ink hover:border-[#C7D2F0] dark:hover:border-[#2A3555] transition-colors"
          >
            <IconChevronRight size={16} />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {REVIEWS.map((rev, i) => (
              <button
                key={rev.name}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index ? "w-6 h-1.5 bg-orange" : "w-1.5 h-1.5 bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
