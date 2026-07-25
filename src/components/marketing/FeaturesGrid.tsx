import FadeInSection from "@/components/motion/FadeInSection";
import {
  IconSparkles,
  IconFileDownload,
  IconHistory,
  IconFileInvoice,
  IconClipboardText,
  IconReceipt,
} from "@tabler/icons-react";

const FEATURES = [
  {
    icon: IconFileInvoice,
    title: "Online invoicing",
    desc: "Pick a template, add line items, and send. Formatting and numbering handled for you.",
  },
  {
    icon: IconClipboardText,
    title: "Estimates that convert",
    desc: "Build an estimate, get client approval, and turn it into an invoice with one click.",
  },
  {
    icon: IconReceipt,
    title: "Expense tracking",
    desc: "Snap a photo of a receipt, categorize it, and rebill it to a client when needed.",
  },
  {
    icon: IconSparkles,
    title: "AI line-item polish",
    desc: "Rough notes become client-ready descriptions automatically.",
  },
  {
    icon: IconFileDownload,
    title: "Instant PDF export",
    desc: "Branded, ready-to-send invoices and receipts in one click.",
  },
  {
    icon: IconHistory,
    title: "Invoice history",
    desc: "Every invoice saved, searchable, and easy to mark as paid.",
  },
];

// Reference: billora_landing_page_v2.html feature grid + condensed
// content from billora_online_invoicing_page.html, billora_estimating_page.html,
// billora_expense_tracking_page.html (merged here as part of the single-page site)
export default function FeaturesGrid() {
  return (
    <section id="features" className="scroll-mt-20 px-7 py-16 max-w-6xl mx-auto">
      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-6">
          Everything you need
        </p>
      </FadeInSection>
      <div className="grid md:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <FadeInSection key={f.title} delay={i * 0.08}>
            <div className="bg-white rounded-lg p-5 h-full">
              <f.icon size={22} className="text-orange" />
              <p className="text-sm font-medium text-navy mt-2.5 mb-1">{f.title}</p>
              <p className="text-xs text-muted">{f.desc}</p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
