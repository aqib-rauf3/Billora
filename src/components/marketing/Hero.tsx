import FadeInSection from "@/components/motion/FadeInSection";
import MagneticButton from "@/components/motion/MagneticButton";
import HeroAurora from "./HeroAurora";
import HeroHeadingReveal from "./HeroHeadingReveal";
import HeroInvoiceMockup from "./HeroInvoiceMockup";

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

      <div className="grid md:grid-cols-2 gap-8 px-7 py-16 md:py-24 items-center max-w-6xl mx-auto">
        <FadeInSection>
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            AI-powered line items
          </span>
          <h1 className="text-3xl md:text-[34px] leading-tight font-medium text-ink mb-4">
            <HeroHeadingReveal words={["Invoicing", "that", "writes"]} />
            <br />
            <HeroHeadingReveal words={["itself,", "almost."]} startDelay={0.36} />
          </h1>
          <p className="text-sm md:text-[15px] text-text leading-relaxed mb-6 max-w-md">
            Type a rough line item, get a polished invoice. Track paid and unpaid bills in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton
              href="/login"
              className="inline-block bg-navy text-white rounded-md px-6 py-3 text-sm hover:bg-navyLight transition-colors"
            >
              Create your first invoice
            </MagneticButton>
            <MagneticButton
              href="#features"
              strength={0.18}
              className="inline-block bg-surface border border-[#C7D2F0] dark:border-[#2A3555] text-ink rounded-md px-6 py-3 text-sm hover:bg-bg transition-colors"
            >
              See a demo
            </MagneticButton>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <HeroInvoiceMockup />
        </FadeInSection>
      </div>
    </div>
  );
}
