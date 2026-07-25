"use client";

import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";

const PLANS = [
  {
    name: "Starter",
    tagline: "For freelancers just getting paid",
    monthly: 0,
    yearly: 0,
    features: ["5 invoices / month", "1 client", "PDF export"],
    highlight: false,
  },
  {
    name: "Growth",
    tagline: "For freelancers with regular clients",
    monthly: 1200,
    yearly: 960,
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "AI line-item polish",
      "Payment reminders",
    ],
    highlight: true,
  },
  {
    name: "Business",
    tagline: "For teams and agencies",
    monthly: 3000,
    yearly: 2400,
    features: ["Everything in Growth", "5 team members", "Financial reports", "Priority support"],
    highlight: false,
  },
];

// Reference: billora_pricing_page.html
export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-20 px-7 py-16 max-w-6xl mx-auto">
      <FadeInSection>
        <div className="text-center mb-6">
          <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
            7-day free trial, no card needed
          </span>
          <h2 className="text-2xl md:text-[28px] font-medium text-ink mb-2">
            Simple pricing, no surprises
          </h2>
          <p className="text-sm text-text">Cancel anytime. All plans include unlimited invoices.</p>
        </div>

        <div className="flex items-center justify-center gap-2.5 py-3 mb-8">
          <span className={`text-sm ${!yearly ? "text-ink font-medium" : "text-text"}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className="w-9 h-5 rounded-full bg-navy relative transition-colors"
            aria-label="Toggle yearly billing"
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                yearly ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-sm ${yearly ? "text-ink font-medium" : "text-text"}`}>Yearly</span>
          <span className="text-xs bg-greenBg text-green px-2 py-0.5 rounded-full">Save 20%</span>
        </div>
      </FadeInSection>

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => (
          <FadeInSection key={plan.name} delay={i * 0.1}>
            <div
              className={`bg-surface rounded-xl p-6 h-full relative ${
                plan.highlight ? "border-2 border-orange" : "border border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-[11px] left-5 bg-orange text-white text-xs px-3 py-0.5 rounded-full">
                  Most popular
                </div>
              )}
              <p className="text-sm font-medium text-ink mb-1">{plan.name}</p>
              <p className="text-xs text-muted mb-4">{plan.tagline}</p>
              <p className="mb-5">
                <span className="text-[28px] font-medium text-ink">
                  Rs. {(yearly ? plan.yearly : plan.monthly).toLocaleString()}
                </span>
                <span className="text-xs text-muted"> /month</span>
              </p>
              <button
                className={`w-full rounded-md py-2.5 text-sm mb-5 transition-colors ${
                  plan.highlight
                    ? "bg-navy text-white hover:bg-navyLight"
                    : "bg-surface border border-[#C7D2F0] dark:border-[#2A3555] text-ink hover:bg-bg"
                }`}
              >
                {plan.monthly === 0 ? "Start free" : "Start free trial"}
              </button>
              <div className="text-xs text-text space-y-2.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <IconCheck size={14} className="text-green flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
