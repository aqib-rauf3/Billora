"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import FadeInSection from "@/components/motion/FadeInSection";

const FAQS = [
  {
    q: "Do I need a credit card to try Billora?",
    a: "No. The Starter plan and all three free tools (invoice generator, estimate generator, receipt maker) work without a card or account.",
  },
  {
    q: "What happens to my invoices if I cancel?",
    a: "You keep access to export your existing invoices and estimates as PDF for 30 days after cancelling. Nothing is deleted immediately.",
  },
  {
    q: "Can I invoice clients in a different currency?",
    a: "Yes — the Growth and Business plans support multi-currency invoicing, so you can bill international clients in their own currency.",
  },
  {
    q: "How is the free invoice generator different from the app?",
    a: "The free tools are single-use, client-side only — nothing is saved. The full app adds saved templates, recurring invoices, payment tracking, and history.",
  },
  {
    q: "Can I switch between monthly and yearly billing?",
    a: "Yes, any time from your account settings. Switching to yearly applies the 20% discount from your next billing cycle.",
  },
];

// FAQ accordion — per COMPONENT_GUIDE.md's FAQ spec (smooth animation,
// keyboard support, accessible). Single-open accordion using native
// <button aria-expanded> so it's keyboard/screen-reader operable without
// any extra ARIA wiring, height animated via Framer's layout auto so the
// expand/collapse stays GPU-friendly.
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section id="faq" className="px-7 py-16 max-w-3xl mx-auto">
      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-1.5">
          Questions
        </p>
        <h2 className="text-xl md:text-2xl font-medium text-ink text-center mb-10">
          Frequently asked questions
        </h2>
      </FadeInSection>

      <div className="space-y-2">
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <FadeInSection key={item.q} delay={i * 0.05}>
              <div className="bg-surface rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                >
                  <span className="text-sm font-medium text-ink">{item.q}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="shrink-0 text-muted"
                  >
                    <IconPlus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-muted leading-relaxed px-5 pb-4">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInSection>
          );
        })}
      </div>
    </section>
  );
}
