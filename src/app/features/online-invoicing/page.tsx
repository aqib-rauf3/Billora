// Online Invoicing (feature page)
// Reference mockup: billora_online_invoicing_page.png
// Marketing/explainer page with a sample invoice preview

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
        { title: "66+ ready templates", desc: "Pick a style, drop in your logo and colors." },
        { title: "Recurring invoices", desc: "Auto-send to retainer clients every month." },
        { title: "Multi-currency support", desc: "Bill international clients in their currency." },
        { title: "Share via WhatsApp or email", desc: "Send a link, no attachment needed." },
      ]}
      ctaHeading="Ready to send your first invoice?"
      ctaSubtext="No credit card required. Cancel anytime."
    />
  );
}
