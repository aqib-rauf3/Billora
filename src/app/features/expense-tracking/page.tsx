// Expense Tracking (feature page)
// Reference mockup: billora_expense_tracking_page.png
// Marketing/explainer page with a sample spending summary

import {
  IconScan,
  IconCategory,
  IconReceipt2,
  IconChartBar,
} from "@tabler/icons-react";
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
      stepsLabel="How it works"
      steps={[
        {
          title: "Snap or upload a receipt",
          desc: "Take a photo or upload a file straight from your phone or desktop.",
        },
        {
          title: "Auto-categorized",
          desc: "Amount, vendor, and category fill in automatically — no manual tagging.",
        },
        {
          title: "Rebill if billable",
          desc: "Turn any expense into a client invoice line item in one click.",
        },
      ]}
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
        {
          title: "AI receipt scan",
          desc: "Snap a photo, amount and vendor auto-fill.",
          icon: IconScan,
        },
        {
          title: "Auto categorization",
          desc: "Expenses sorted by category without manual tags.",
          icon: IconCategory,
        },
        {
          title: "Rebill to clients",
          desc: "Turn a billable expense into an invoice line item.",
          icon: IconReceipt2,
        },
        {
          title: "Spending breakdown",
          desc: "See where your money goes, month over month.",
          icon: IconChartBar,
        },
      ]}
      ctaHeading="Start tracking expenses today"
      ctaSubtext="No credit card required. Cancel anytime."
    />
  );
}
