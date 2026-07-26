"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { IconCheck, IconTrendingUp } from "@tabler/icons-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useTypewriter } from "@/hooks/useTypewriter";

// Hero "live invoice" animation — Reference: uploaded phone-search reference video
// (reused mechanics: staggered reveal, count-up, glow pop, floating badges),
// rebuilt with Billora's own invoice data and brand palette.

const LINE_ITEMS = [
  { label: "Landing page redesign", amount: 45000 },
  { label: "API integration (x6)", amount: 21000 },
];
const TOTAL = 69300;
const CYCLE_MS = 7000;
const TYPE_SPEED = 24;
// Second item starts typing once the first has finished (length-aware, not
// a fixed guess) so the sequence never looks like it's racing ahead of itself.
const ITEM_START_MS = [300, 300 + LINE_ITEMS[0].label.length * TYPE_SPEED + 250];
const TOTAL_START_MS =
  ITEM_START_MS[1] + LINE_ITEMS[1].label.length * TYPE_SPEED + 350;

function TypedLabel({
  text,
  cycle,
  startDelay,
  reduceMotion,
}: {
  text: string;
  cycle: number;
  startDelay: number;
  reduceMotion: boolean;
}) {
  const [active, setActive] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setActive(true);
      return;
    }
    setActive(false);
    const t = setTimeout(() => setActive(true), startDelay);
    return () => clearTimeout(t);
  }, [cycle, startDelay, reduceMotion]);

  const shown = useTypewriter(text, active, cycle, TYPE_SPEED, reduceMotion);
  const done = shown.length >= text.length;

  return (
    <span>
      {shown}
      {!reduceMotion && !done && active && (
        <span className="inline-block w-[2px] h-[10px] bg-orange ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HeroInvoiceMockup() {
  const reduceMotion = Boolean(useReducedMotion());
  const [cycle, setCycle] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showPaid, setShowPaid] = useState(false);
  const [showBadges, setShowBadges] = useState(false);

  // Sequence within a single cycle: items -> total -> paid badge -> stat badges
  useEffect(() => {
    if (reduceMotion) {
      setShowTotal(true);
      setShowPaid(true);
      setShowBadges(true);
      return;
    }
    const t1 = setTimeout(() => setShowTotal(true), TOTAL_START_MS);
    const t2 = setTimeout(() => setShowPaid(true), TOTAL_START_MS + 1000);
    const t3 = setTimeout(() => setShowBadges(true), TOTAL_START_MS + 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [cycle, reduceMotion]);

  // Loop the whole sequence, respecting reduced-motion users
  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setShowTotal(false);
      setShowPaid(false);
      setShowBadges(false);
      setCycle((c) => c + 1);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const total = useCountUp(TOTAL, showTotal, reduceMotion);

  return (
    <div className="relative">
      {/* Depth echo — a soft duplicate card offset behind the main one,
          echoing the StackedPanel scroll motif so the hero itself feels
          layered before the user ever scrolls. */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-4 scale-[0.97] rounded-xl bg-surface border border-border opacity-40 blur-[1.5px] -z-10"
      />

      {/* Floating stat badges, orbiting the card */}
      <AnimatePresence>
        {showBadges && (
          <>
            <motion.div
              key={`revenue-${cycle}`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.25 } }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              className="hidden md:flex absolute -top-6 -left-8 items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-2 shadow-sm z-20"
            >
              <IconTrendingUp size={14} className="text-green" stroke={2} />
              <span className="text-xs font-medium text-green">Revenue +24%</span>
            </motion.div>

            <motion.div
              key={`sent-${cycle}`}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: [0, 6, 0], scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.25 } }}
              transition={{
                opacity: { duration: 0.4, delay: 0.15 },
                scale: { duration: 0.4, delay: 0.15 },
                y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
              }}
              className="hidden md:flex absolute -bottom-5 -right-6 items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-2 shadow-sm z-20"
            >
              <span className="text-xs font-medium text-ink">3 invoices sent</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invoice card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cycle}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-surface rounded-xl p-5 relative shadow-sm border border-border"
        >
          <div className="flex justify-between items-center mb-3.5 min-h-[22px]">
            <span className="text-sm font-medium text-ink">Northline Traders</span>
            <AnimatePresence>
              {showPaid && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex items-center gap-1 text-xs bg-greenBg text-green px-2.5 py-0.5 rounded-full"
                >
                  <IconCheck size={12} stroke={3} />
                  Paid
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="border-y border-border py-3 mb-3 space-y-2">
            {LINE_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-between text-xs text-text"
              >
                <TypedLabel
                  text={item.label}
                  cycle={cycle}
                  startDelay={ITEM_START_MS[i]}
                  reduceMotion={reduceMotion}
                />
                <span className="font-mono">{item.amount.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between text-base font-medium text-ink">
            <span>Total</span>
            <span className="font-mono">Rs. {Math.round(total).toLocaleString()}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute -top-2.5 -right-2.5"
          >
            <motion.span
              animate={{
                scale: [1, 1.07, 1],
                boxShadow: [
                  "0 0 0 0 rgba(255,75,54,0.35)",
                  "0 0 0 6px rgba(255,75,54,0)",
                  "0 0 0 0 rgba(255,75,54,0)",
                ],
              }}
              transition={{ delay: 1.1, duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="block bg-orange text-white text-xs px-2.5 py-1.5 rounded-lg"
            >
              ✨ polished
            </motion.span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
