import FadeInSection from "@/components/motion/FadeInSection";
import MagneticButton from "@/components/motion/MagneticButton";
import TiltCard from "@/components/motion/TiltCard";
import HeroAurora from "./HeroAurora";
import HeroHeadingReveal from "./HeroHeadingReveal";
import HeroInvoiceMockup from "./HeroInvoiceMockup";
import ParticleField from "./ParticleField";
import { IconCreditCardOff, IconClockHour4, IconUsers } from "@tabler/icons-react";

const TRUST_BADGES = [
  { icon: IconCreditCardOff, label: "No credit card required" },
  { icon: IconClockHour4, label: "Setup in 2 minutes" },
  { icon: IconUsers, label: "Trusted by 40,000+ freelancers" },
];

// Hero section — Reference: billora_landing_page_v2.html hero
// Background aurora + invoice mockup reuse the motion mechanics from the
// uploaded reference video (glow, float, staggered reveal), rebuilt with
// Billora's own invoice content and brand palette. Aurora now drifts with
// the cursor (HeroAurora) and the heading reveals word-by-word
// (HeroHeadingReveal) per MOTION_SYSTEM.md's Hero spec.
export default function Hero() {
  return (
    <div className="relative flex-1 flex flex-col justify-center overflow-hidden">
      <HeroAurora />
      <ParticleField />

      <div className="grid md:grid-cols-2 gap-8 px-7 py-16 md:py-24 items-center max-w-6xl mx-auto">
        <FadeInSection>
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-5">
            AI-powered line items
          </span>
          <h1 className="text-3xl md:text-[38px] leading-[1.15] tracking-[-0.01em] font-medium text-ink mb-5">
            <HeroHeadingReveal words={["Invoicing", "that", "writes"]} />
            <br />
            <HeroHeadingReveal words={["itself,", "almost."]} startDelay={0.36} />
          </h1>
          <p className="text-sm md:text-[15px] text-text leading-relaxed mb-7 max-w-[420px]">
            Type a rough line item, get a polished invoice. Track paid and unpaid bills in one place.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <MagneticButton
              href="/login"
              className="inline-block bg-navy text-white rounded-md px-6 py-3 text-sm transition-[background-color,box-shadow] duration-200 hover:bg-navyLight hover:shadow-[0_8px_28px_-6px_rgba(11,37,69,0.45)]"
            >
              Create your first invoice
            </MagneticButton>
            <MagneticButton
              href="#features"
              strength={0.18}
              className="inline-block bg-surface border border-[#C7D2F0] dark:border-[#2A3555] text-ink rounded-md px-6 py-3 text-sm transition-[background-color,box-shadow] duration-200 hover:bg-bg hover:shadow-[0_8px_24px_-8px_rgba(11,37,69,0.2)]"
            >
              See a demo
            </MagneticButton>
          </div>

          <FadeInSection delay={0.5}>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {TRUST_BADGES.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 text-xs text-muted">
                  <b.icon size={14} className="text-green flex-shrink-0" />
                  {b.label}
                </span>
              ))}
            </div>
          </FadeInSection>
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <TiltCard>
            <HeroInvoiceMockup />
          </TiltCard>
        </FadeInSection>
      </div>
    </div>
  );
}
