import FadeInSection from "@/components/motion/FadeInSection";
import GlowCard from "@/components/motion/GlowCard";
import { IconFileInvoice, IconClipboardText, IconReceipt, IconArrowRight } from "@tabler/icons-react";

const TOOLS = [
  {
    icon: IconFileInvoice,
    title: "Invoice Generator",
    desc: "Fill in line items, see a live preview, save as PDF.",
    href: "/tools/invoice-generator",
  },
  {
    icon: IconClipboardText,
    title: "Estimate Generator",
    desc: "Send a polished estimate before you're even signed up.",
    href: "/tools/estimate-generator",
  },
  {
    icon: IconReceipt,
    title: "Receipt Maker",
    desc: "Turn a payment into a clean, printable receipt.",
    href: "/tools/receipt-maker",
  },
];

// Homepage teaser for the 3 free, no-signup tools — previously only
// reachable via the Navbar "Free tools" dropdown or Footer. Sits between
// Features and Pricing so a visitor can try the product before signing up.
export default function FreeToolsStrip() {
  return (
    <section className="px-7 py-16 max-w-6xl mx-auto">
      <FadeInSection>
        <p className="text-xs tracking-wide text-muted uppercase text-center mb-1.5">
          No signup required
        </p>
        <h2 className="text-xl font-medium text-ink text-center mb-8">Try a free tool right now</h2>
      </FadeInSection>
      <div className="grid md:grid-cols-3 gap-4">
        {TOOLS.map((t, i) => (
          <FadeInSection key={t.title} delay={i * 0.08} className="h-full">
            <GlowCard
              href={t.href}
              className="flex flex-col h-full bg-surface rounded-lg p-5 border border-transparent hover:border-[#C7D2F0] dark:hover:border-[#2A3555] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <t.icon size={22} className="text-orange" />
              <p className="text-sm font-medium text-ink mt-2.5 mb-1">{t.title}</p>
              <p className="text-xs text-muted mb-3 flex-1">{t.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs text-ink font-medium">
                Open tool
                <IconArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </GlowCard>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
