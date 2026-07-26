import { ComponentType, ReactNode } from "react";
import { IconCheck } from "@tabler/icons-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FadeInSection from "@/components/motion/FadeInSection";
import GlowCard from "@/components/motion/GlowCard";

export interface FeatureBenefit {
  title: string;
  desc: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
}

export interface FeatureStep {
  title: string;
  desc: string;
}

interface FeaturePageLayoutProps {
  badge: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCtaLabel: string;
  preview: ReactNode;
  sectionLabel: string;
  benefits: FeatureBenefit[];
  steps?: FeatureStep[];
  stepsLabel?: string;
  ctaHeading: string;
  ctaSubtext: string;
}

// Shared layout for the three feature/explainer marketing pages
// (Online Invoicing, Estimating, Expense Tracking). Each page supplies its
// own copy + a bespoke preview card; the surrounding hero / how-it-works /
// benefits grid / closing CTA structure stays identical to keep the design
// language consistent across all three, per BRAND_GUIDELINES.md and
// COMPONENT_GUIDE.md. The optional `steps` section and icon-equipped
// `benefits` bring these pages in line with the richer design-reference
// mockups (billora_online_invoicing_page.png etc.), which show a
// numbered "how it works" walkthrough above the benefit grid rather than
// jumping straight from hero to bullet list.
export default function FeaturePageLayout({
  badge,
  title,
  description,
  primaryCta,
  secondaryCtaLabel,
  preview,
  sectionLabel,
  benefits,
  steps,
  stepsLabel = "How it works",
  ctaHeading,
  ctaSubtext,
}: FeaturePageLayoutProps) {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <section className="grid md:grid-cols-2 gap-8 px-7 py-16 md:py-24 items-center max-w-6xl mx-auto">
        <FadeInSection>
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            {badge}
          </span>
          <h1 className="text-3xl md:text-[34px] leading-tight font-medium text-ink mb-4">
            {title}
          </h1>
          <p className="text-sm md:text-[15px] text-text leading-relaxed mb-6 max-w-md">
            {description}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={primaryCta.href}
              className="bg-navy text-white rounded-md px-6 py-3 text-sm hover:bg-navyLight transition-colors"
            >
              {primaryCta.label}
            </a>
            <a
              href="#how-it-works"
              className="bg-surface border border-[#C7D2F0] dark:border-[#2A3555] text-ink rounded-md px-6 py-3 text-sm hover:bg-bg transition-colors"
            >
              {secondaryCtaLabel}
            </a>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.15}>{preview}</FadeInSection>
      </section>

      {steps && steps.length > 0 && (
        <section id="how-it-works" className="px-7 pb-16 max-w-6xl mx-auto">
          <FadeInSection>
            <p className="text-xs tracking-wide text-muted uppercase text-center mb-10">
              {stepsLabel}
            </p>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <FadeInSection key={s.title} delay={i * 0.1} className="relative">
                {/* connecting line between step numbers on desktop */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:block absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-[#E4E9F7] dark:bg-[#232B45]"
                  />
                )}
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 w-10 h-10 rounded-full bg-navy text-white text-sm font-medium flex items-center justify-center mb-4">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-ink mb-1.5">{s.title}</p>
                  <p className="text-xs text-muted max-w-[220px]">{s.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>
      )}

      <section className="px-7 pb-16 max-w-6xl mx-auto">
        <FadeInSection>
          <p className="text-xs tracking-wide text-muted uppercase text-center mb-6">
            {sectionLabel}
          </p>
        </FadeInSection>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((b, i) => {
            const BenefitIcon = b.icon;
            return (
              <FadeInSection key={b.title} delay={i * 0.08}>
                <GlowCard className="bg-surface rounded-lg p-5 h-full border border-transparent hover:border-[#E4E9F7] dark:hover:border-[#232B45] hover:-translate-y-0.5 transition-all duration-300">
                  {BenefitIcon && (
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-redBg text-red mb-3">
                      <BenefitIcon size={18} />
                    </span>
                  )}
                  <p className="text-sm font-medium text-ink mb-1">{b.title}</p>
                  <p className="text-xs text-muted">{b.desc}</p>
                </GlowCard>
              </FadeInSection>
            );
          })}
        </div>
      </section>

      <FadeInSection>
        <section className="bg-navy px-7 py-10 text-center">
          <p className="text-lg font-medium text-white mb-1.5">{ctaHeading}</p>
          <p className="text-sm text-[#AEB8E0] mb-4.5">{ctaSubtext}</p>
          <a
            href="/login"
            className="inline-block bg-orange text-white rounded-md px-6 py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            Try it free
          </a>
        </section>
      </FadeInSection>

      <Footer />
    </main>
  );
}

// Small shared building block for the "polished" style preview cards used
// in each hero (invoice / estimate / expense summary).
export function PreviewCard({
  eyebrow,
  status,
  statusTone = "amber",
  rows,
  totalLabel,
  totalValue,
  ctaLabel,
}: {
  eyebrow: string;
  status: string;
  statusTone?: "amber" | "green" | "red";
  rows: { label: string; value: string }[];
  totalLabel?: string;
  totalValue?: string;
  ctaLabel: string;
}) {
  const toneClasses = {
    amber: "bg-amberBg text-amber",
    green: "bg-greenBg text-green",
    red: "bg-redBg text-red",
  }[statusTone];

  return (
    <div className="bg-surface rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-sm font-medium text-ink">{eyebrow}</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full ${toneClasses}`}>{status}</span>
      </div>
      <div className="border-y border-[#EEF1FB] dark:border-[#232B45] py-3 mb-3 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-xs text-text">
            <span>{r.label}</span>
            <span className="font-mono">{r.value}</span>
          </div>
        ))}
      </div>
      {totalLabel && totalValue && (
        <div className="flex justify-between text-base font-medium text-ink mb-4">
          <span>{totalLabel}</span>
          <span className="font-mono">{totalValue}</span>
        </div>
      )}
      <a
        href="/login"
        className="block w-full text-center bg-navy text-white rounded-md py-2.5 text-sm hover:bg-navyLight transition-colors"
      >
        {ctaLabel}
      </a>
    </div>
  );
}

// Icon-check row list used inside PreviewCard alternatives, kept here so
// future preview variants can reuse the same check-style row if needed.
export function CheckRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text">
      <IconCheck size={14} className="text-green flex-shrink-0" />
      {label}
    </div>
  );
}
