import FadeInSection from "@/components/motion/FadeInSection";
import GlowCard from "@/components/motion/GlowCard";
import {
  IconSparkles,
  IconFileDownload,
  IconHistory,
  IconFileInvoice,
  IconClipboardText,
  IconReceipt,
  IconArrowRight,
} from "@tabler/icons-react";

const FEATURES = [
  {
    icon: IconFileInvoice,
    title: "Online invoicing",
    desc: "Pick a template, add line items, and send. Formatting and numbering handled for you.",
    href: "/features/online-invoicing",
  },
  {
    icon: IconClipboardText,
    title: "Estimates that convert",
    desc: "Build an estimate, get client approval, and turn it into an invoice with one click.",
    href: "/features/estimating",
  },
  {
    icon: IconReceipt,
    title: "Expense tracking",
    desc: "Snap a photo of a receipt, categorize it, and rebill it to a client when needed.",
    href: "/features/expense-tracking",
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
// billora_expense_tracking_page.html (merged here as part of the single-page site).
// The 3 cards that have a dedicated feature page are now real links (hover:
// lift + border + light "Explore" affordance, per MOTION_SYSTEM.md Cards
// spec) so a homepage visitor can click straight through instead of only
// finding these pages via the Navbar/Footer.
export default function FeaturesGrid() {
  return (
    <div className="flex-1 flex flex-col justify-center px-7 py-16 max-w-6xl mx-auto w-full">
      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-6">
          Everything you need
        </p>
      </FadeInSection>
      <div className="grid md:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => {
          const content = (
            <>
              <f.icon size={22} className="text-orange" />
              <p className="text-sm font-medium text-ink mt-2.5 mb-1 flex items-center gap-1.5">
                {f.title}
                {f.href && (
                  <IconArrowRight
                    size={14}
                    className="text-orange opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                  />
                )}
              </p>
              <p className="text-xs text-muted">{f.desc}</p>
            </>
          );

          return (
            <FadeInSection key={f.title} delay={i * 0.08} className="h-full">
              {f.href ? (
                <GlowCard
                  href={f.href}
                  className="group block bg-surface rounded-lg p-5 h-full border border-transparent hover:border-[#C7D2F0] dark:hover:border-[#2A3555] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {content}
                </GlowCard>
              ) : (
                <div className="bg-surface rounded-lg p-5 h-full">{content}</div>
              )}
            </FadeInSection>
          );
        })}
      </div>
    </div>
  );
}
