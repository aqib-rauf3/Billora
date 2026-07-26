"use client";

import { useEffect, useRef, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { IconTrendingUp, IconCheck } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";
import { useCountUp } from "@/hooks/useCountUp";

// Marketing-only preview of the real (app) Dashboard — sample numbers,
// not live data (the actual Dashboard lives at /dashboard and reads from
// src/lib/mockData.ts). Purpose here is purely illustrative: give a
// homepage visitor a peek at what the product looks like day to day.
// The whole card is scroll-triggered (chart redraws, revenue counts up,
// one invoice's status flips live) so it reads as a "demo playing" rather
// than a static screenshot.
const REVENUE_TREND = [
  { m: "Feb", v: 210000 },
  { m: "Mar", v: 238000 },
  { m: "Apr", v: 227000 },
  { m: "May", v: 265000 },
  { m: "Jun", v: 291000 },
  { m: "Jul", v: 312400 },
];
const TOTAL_EARNED = 312400;
const PAYMENTS_COUNT = 27;

const RECENT_BASE = [
  { client: "Northline Traders", amount: "Rs. 69,300", status: "Pending" as const },
  { client: "Zara Designs", amount: "Rs. 29,000", status: "Paid" as const },
  { client: "Devko Traders", amount: "Rs. 52,100", status: "Paid" as const },
];

const money = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

export default function ProductDashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = Boolean(useReducedMotion());

  const totalEarned = useCountUp(TOTAL_EARNED, inView, reduceMotion, 1400);
  const payments = useCountUp(PAYMENTS_COUNT, inView, reduceMotion, 1100);

  // Once in view, flip the first invoice from Pending to Paid after a beat —
  // a small "the product is alive" moment rather than a frozen screenshot.
  const [firstStatus, setFirstStatus] = useState<"Pending" | "Paid">("Pending");
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setFirstStatus("Paid");
      return;
    }
    const t = setTimeout(() => setFirstStatus("Paid"), 2600);
    return () => clearTimeout(t);
  }, [inView, reduceMotion]);

  const recent = RECENT_BASE.map((r, i) => (i === 0 ? { ...r, status: firstStatus } : r));

  return (
    <section ref={ref} className="px-7 py-16 max-w-6xl mx-auto">
      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-1.5">
          Inside the app
        </p>
        <h2 className="text-xl md:text-2xl font-medium text-ink text-center mb-2">
          Your whole business, one screen
        </h2>
        <p className="text-sm text-text text-center max-w-md mx-auto mb-10">
          Revenue, outstanding invoices, and payments — the same dashboard you land on every time you log in.
        </p>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-bg border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Total earned</p>
              <p className="text-lg font-medium text-ink font-mono">{money(totalEarned)}</p>
              <div className="h-14 -mx-1 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    key={inView ? "in" : "out"}
                    data={REVENUE_TREND}
                    margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF4B36" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#FF4B36" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#FF4B36"
                      strokeWidth={2}
                      fill="url(#revFill)"
                      isAnimationActive={inView && !reduceMotion}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-bg border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Outstanding</p>
              <p className="text-lg font-medium text-ink font-mono">Rs. 48,000</p>
              <p className="flex items-center gap-1 text-xs text-red mt-2">
                <IconTrendingUp size={13} />2 invoices overdue
              </p>
            </div>

            <div className="bg-bg border border-border rounded-lg p-4">
              <p className="text-xs text-muted mb-1">Payments this month</p>
              <p className="text-lg font-medium text-ink font-mono">{Math.round(payments)}</p>
              <p className="flex items-center gap-1 text-xs text-green mt-2">
                <IconCheck size={13} />9 active clients
              </p>
            </div>
          </div>

          <div className="bg-bg border border-border rounded-lg overflow-hidden">
            <p className="text-xs font-medium text-ink px-4 py-3 border-b border-border">
              Recent invoices
            </p>
            {recent.map((r) => (
              <div
                key={r.client}
                className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0"
              >
                <span className="text-xs text-ink truncate">{r.client}</span>
                <span className="text-xs font-mono text-ink">{r.amount}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={r.status}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    className={`text-[11px] rounded-full px-2 py-0.5 ${
                      r.status === "Paid" ? "bg-greenBg text-green" : "bg-amberBg text-amber"
                    }`}
                  >
                    {r.status}
                  </motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
