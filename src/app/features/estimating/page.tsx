// Estimating (feature page)
// Reference mockup: billora_estimating_page.png
// Marketing/explainer page with a sample estimate preview

import {
  IconClick,
  IconThumbUp,
  IconTemplate,
  IconBellRinging,
} from "@tabler/icons-react";
import FeaturePageLayout, { PreviewCard } from "@/components/marketing/FeaturePageLayout";

export default function EstimatingPage() {
  return (
    <FeaturePageLayout
      badge="Estimating software"
      title="Send estimates that win the job"
      description="Build a polished estimate, get client approval, and convert it into an invoice with one click. No re-typing."
      primaryCta={{ label: "Create an estimate", href: "/login" }}
      secondaryCtaLabel="Watch demo"
      sectionLabel="From quote to cash, faster"
      stepsLabel="How it works"
      steps={[
        {
          title: "Build the estimate",
          desc: "Add your line items and scope of work using a reusable template.",
        },
        {
          title: "Client reviews & approves",
          desc: "They approve or reject with a single tap — no back-and-forth emails.",
        },
        {
          title: "Convert to invoice",
          desc: "One click turns the approved estimate into a ready-to-send invoice.",
        },
      ]}
      preview={
        <PreviewCard
          eyebrow="Estimate #EST-0087"
          status="Approved"
          statusTone="green"
          rows={[
            { label: "Website UI design", value: "35,000" },
            { label: "Frontend build (x8 pages)", value: "60,000" },
          ]}
          totalLabel="Estimated total"
          totalValue="Rs. 95,000"
          ctaLabel="Convert to invoice"
        />
      }
      benefits={[
        {
          title: "One-click convert",
          desc: "Approved estimate becomes an invoice instantly.",
          icon: IconClick,
        },
        {
          title: "Client e-approval",
          desc: "Clients approve or reject with a single tap.",
          icon: IconThumbUp,
        },
        {
          title: "Reusable templates",
          desc: "Save your line-item sets for repeat project types.",
          icon: IconTemplate,
        },
        {
          title: "Expiry reminders",
          desc: "Nudge clients before the estimate expires.",
          icon: IconBellRinging,
        },
      ]}
      ctaHeading="Win more jobs with sharper estimates"
      ctaSubtext="No credit card required. Cancel anytime."
    />
  );
}
