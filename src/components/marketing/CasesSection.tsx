"use client";

import { IconArrowUpRight, IconBriefcase, IconCode, IconPalette, IconCamera, IconPencil } from "@tabler/icons-react";
import { useReducedMotion } from "framer-motion";
import FadeInSection from "@/components/motion/FadeInSection";

// "Our work" showcase — Reference: uploaded video's OUR CASES section
// (giant ghost heading behind a horizontally-moving card row). Rebuilt with
// real Billora usage stats instead of invented client testimonials, and a
// continuous auto-sliding marquee (CSS keyframe, GPU-only translateX) in
// place of the earlier manual-scroll row, per user feedback that the cards
// should keep moving and read as more premium/unique than flat color blocks.
const CASES = [
  { icon: IconPalette, kind: "Design studio", stat: "Rs. 340K", detail: "collected via Billora, last 90 days", tone: "text-red", tint: "bg-redBg" },
  { icon: IconCode, kind: "Dev agency", stat: "128", detail: "invoices sent this quarter", tone: "text-green", tint: "bg-greenBg" },
  { icon: IconBriefcase, kind: "Consultant", stat: "2 min", detail: "average time to build an invoice", tone: "text-amber", tint: "bg-amberBg" },
  { icon: IconCamera, kind: "Freelance photographer", stat: "3", detail: "currencies invoiced in", tone: "text-red", tint: "bg-redBg" },
  { icon: IconPencil, kind: "Copywriter", stat: "100%", detail: "of invoices paid on time", tone: "text-green", tint: "bg-greenBg" },
];

function CaseCard({ c }: { c: (typeof CASES)[number] }) {
  return (
    <div className="shrink-0 w-[260px] md:w-[280px] bg-surface rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-6 ${c.tint} ${c.tone}`}>
        <c.icon size={20} stroke={1.75} />
      </div>
      <p className="text-3xl font-medium text-ink mb-1.5 tabular-nums">{c.stat}</p>
      <p className="text-xs text-muted leading-relaxed mb-4 min-h-[32px]">{c.detail}</p>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs font-medium text-ink/80">{c.kind}</p>
        <IconArrowUpRight size={14} className="text-muted" />
      </div>
    </div>
  );
}

export default function CasesSection() {
  const reduceMotion = Boolean(useReducedMotion());
  // Duplicate the row once so the marquee loop is seamless (-50% = exactly
  // one full set scrolled), and pause on hover for anyone who wants to read.
  const track = [...CASES, ...CASES];

  return (
    <div className="flex-1 flex flex-col justify-center py-16 overflow-hidden">
      {/* Giant ghost heading, sits behind the card row */}
      <div aria-hidden className="select-none pointer-events-none -mb-6 md:-mb-10">
        <p className="text-[64px] md:text-[120px] font-medium leading-none text-ink/[0.05] tracking-tight text-center whitespace-nowrap">
          OUR WORK
        </p>
      </div>

      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-8 relative z-10">
          Built for real businesses
        </p>
      </FadeInSection>

      <div className="relative z-10">
        <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className={`flex gap-4 w-max px-7 ${reduceMotion ? "" : "animate-marquee hover:[animation-play-state:paused]"}`}
          >
            {(reduceMotion ? CASES : track).map((c, i) => (
              <CaseCard key={`${c.kind}-${i}`} c={c} />
            ))}
          </div>
        </div>

        <FadeInSection delay={0.2}>
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className="text-xs text-muted hidden md:inline">Scroll to explore</span>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 bg-navy text-white rounded-full px-5 py-2.5 text-sm hover:bg-navyLight transition-colors"
            >
              Try it free
              <IconArrowUpRight size={16} />
            </a>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
