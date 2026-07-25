import { IconClock, IconUserCheck, IconCoin, IconFileDownload } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";
import GlowCard from "@/components/motion/GlowCard";
import AnimatedStatValue from "@/components/marketing/AnimatedStatValue";

const STATS = [
  { icon: IconClock, value: "2 min", label: "avg. time to create an invoice", tone: "bg-redBg text-red" },
  { icon: IconUserCheck, value: "100%", label: "free, no signup wall", tone: "bg-greenBg text-green" },
  { icon: IconCoin, value: "3", label: "currencies supported", tone: "bg-amberBg text-amber" },
  { icon: IconFileDownload, value: "PDF", label: "one-click export", tone: "bg-redBg text-red" },
];

// Reference: billora_landing_page_v2.html stats strip, expanded with a
// heading + icon cards so the panel reads as a full section rather than a
// thin row floating in empty space once it's pinned full-height by
// StackedPanel.
export default function StatsStrip() {
  return (
    <div className="relative flex-1 flex items-center px-7 py-16">
      {/* subtle decorative dot grid, brand-safe and low-opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] [background-image:radial-gradient(rgb(var(--color-border))_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
      />

      <div className="max-w-6xl mx-auto w-full">
        <FadeInSection>
          <div className="text-center max-w-lg mx-auto mb-12">
            <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
              Why freelancers switch
            </span>
            <h2 className="text-2xl md:text-[28px] font-medium text-ink mb-3">
              Numbers that speak for themselves
            </h2>
            <p className="text-sm text-text leading-relaxed">
              Billora is built to get you paid faster — here&apos;s what that looks like in practice.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <FadeInSection key={s.label} delay={i * 0.08} className="h-full">
              <GlowCard className="bg-surface rounded-2xl border border-border p-5 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full mb-3 ${s.tone}`}>
                  <s.icon size={18} stroke={2} />
                </div>
                <AnimatedStatValue raw={s.value} />
                <p className="text-xs text-muted mt-1 leading-relaxed">{s.label}</p>
              </GlowCard>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}
