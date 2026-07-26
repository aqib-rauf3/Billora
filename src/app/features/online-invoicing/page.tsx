// Online Invoicing (feature page)
// Reference mockup: billora_online_invoicing_page.png
// Marketing/explainer page with a sample invoice preview

import {
  IconTemplate,
  IconRepeat,
  IconCoin,
  IconShare,
} from "@tabler/icons-react";
import FeaturePageLayout, { PreviewCard } from "@/components/marketing/FeaturePageLayout";

export default function OnlineInvoicingPage() {
  return (
    <FeaturePageLayout
      badge="Online invoicing"
      title="Create professional invoices in under a minute"
      description="Pick a template, add your line items, and send. Billora handles formatting, numbering, and currency conversion for you."
      primaryCta={{ label: "Start invoicing free", href: "/login" }}
      secondaryCtaLabel="Watch demo"
      sectionLabel="Built for how freelancers actually bill"
      stepsLabel="How it works"
      steps={[
        {
          title: "Pick a template",
          desc: "Choose from ready-made invoice designs and drop in your logo and colors.",
        },
        {
          title: "Add your line items",
          desc: "Enter services, quantities, and rates — totals and tax calculate live.",
        },
        {
          title: "Send and get paid",
          desc: "Share a link via email or WhatsApp and see the moment your client views it.",
        },
      ]}
      preview={
        <PreviewCard
          eyebrow="Invoice #INV-0231"
          status="Pending"
          statusTone="amber"
          rows={[
            { label: "Logo design", value: "15,000" },
            { label: "Brand guideline doc", value: "10,000" },
            { label: "Revisions (x2)", value: "4,000" },
          ]}
          totalLabel="Total"
          totalValue="Rs. 29,000"
          ctaLabel="Send to client"
        />
      }
      benefits={[
        {
          title: "66+ ready templates",
          desc: "Pick a style, drop in your logo and colors.",
          icon: IconTemplate,
        },
        {
          title: "Recurring invoices",
          desc: "Auto-send to retainer clients every month.",
          icon: IconRepeat,
        },
        {
          title: "Multi-currency support",
          desc: "Bill international clients in their currency.",
          icon: IconCoin,
        },
        {
          title: "Share via WhatsApp or email",
          desc: "Send a link, no attachment needed.",
          icon: IconShare,
        },
      ]}
      ctaHeading="Ready to send your first invoice?"
      ctaSubtext="No credit card required. Cancel anytime."
    />
  );
}
