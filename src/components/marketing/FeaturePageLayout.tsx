import { ReactNode } from "react";
import { IconCheck } from "@tabler/icons-react";
import Navbar from "@/components/layout/Navbar";
import FadeInSection from "@/components/motion/FadeInSection";

export interface FeatureBenefit {
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
  ctaHeading: string;
  ctaSubtext: string;
}

// Shared layout for the three feature/explainer marketing pages
// (Online Invoicing, Estimating, Expense Tracking). Each page supplies its
// own copy + a bespoke preview card; the surrounding hero / benefits grid /
// closing CTA structure stays identical to keep the design language
// consistent across all three, per BRAND_GUIDELINES.md and COMPONENT_GUIDE.md.
export default function FeaturePageLayout({
  badge,
  title,
  description,
  primaryCta,
  secondaryCtaLabel,
  preview,
  sectionLabel,
  benefits,
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
          <h1 className="text-3xl md:text-[34px] leading-tight font-medium text-navy mb-4">
            {title}
          </h1>
          <p className="text-sm md:text-[15px] text-text leading-relaxed mb-6 max-w-md">
            {description}
          </p>
          <div className="flex gap-3">
            <a
              href={primaryCta.href}
              className="bg-navy text-white rounded-md px-6 py-3 text-sm hover:bg-navyLight transition-colors"
            >
              {primaryCta.label}
            </a>
            <button className="bg-white border border-[#C7D2F0] text-navy rounded-md px-6 py-3 text-sm hover:bg-bg transition-colors">
              {secondaryCtaLabel}
            </button>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.15}>{preview}</FadeInSection>
      </section>

      <section className="px-7 pb-16 max-w-6xl mx-auto">
        <FadeInSection>
          <p className="text-xs tracking-wide text-muted uppercase text-center mb-6">
            {sectionLabel}
          </p>
        </FadeInSection>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <FadeInSection key={b.title} delay={i * 0.08}>
              <div className="bg-white rounded-lg p-5 h-full">
                <p className="text-sm font-medium text-navy mb-1">{b.title}</p>
                <p className="text-xs text-muted">{b.desc}</p>
              </div>
            </FadeInSection>
          ))}
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
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-sm font-medium text-navy">{eyebrow}</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full ${toneClasses}`}>{status}</span>
      </div>
      <div className="border-y border-[#EEF1FB] py-3 mb-3 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-xs text-text">
            <span>{r.label}</span>
            <span className="font-mono">{r.value}</span>
          </div>
        ))}
      </div>
      {totalLabel && totalValue && (
        <div className="flex justify-between text-base font-medium text-navy mb-4">
          <span>{totalLabel}</span>
          <span className="font-mono">{totalValue}</span>
        </div>
      )}
      <button className="w-full bg-navy text-white rounded-md py-2.5 text-sm hover:bg-navyLight transition-colors">
        {ctaLabel}
      </button>
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
