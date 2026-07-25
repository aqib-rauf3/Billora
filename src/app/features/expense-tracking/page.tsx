// Expense Tracking (feature page)
// Reference mockup: billora_expense_tracking_page.png
// Marketing/explainer page with a sample spending summary

import FeaturePageLayout, { PreviewCard } from "@/components/marketing/FeaturePageLayout";

export default function ExpenseTrackingPage() {
  return (
    <FeaturePageLayout
      badge="Expense tracking"
      title="Know where every rupee went"
      description="Snap a photo of a receipt, categorize it in seconds, and turn expenses into billable line items when needed."
      primaryCta={{ label: "Track an expense", href: "/login" }}
      secondaryCtaLabel="Watch demo"
      sectionLabel="Stop losing receipts"
      preview={
        <PreviewCard
          eyebrow="This month"
          status="Rs. 18,400 spent"
          statusTone="red"
          rows={[
            { label: "Software subscriptions", value: "6,200" },
            { label: "Client travel", value: "7,500" },
            { label: "Client meetings", value: "4,700" },
          ]}
          ctaLabel="Scan a receipt"
        />
      }
      benefits={[
        { title: "AI receipt scan", desc: "Snap a photo, amount and vendor auto-fill." },
        { title: "Auto categorization", desc: "Expenses sorted by category without manual tags." },
        { title: "Rebill to clients", desc: "Turn a billable expense into an invoice line item." },
        { title: "Spending breakdown", desc: "See where your money goes, month over month." },
      ]}
      ctaHeading="Start tracking expenses today"
      ctaSubtext="No credit card required. Cancel anytime."
    />
  );
}
