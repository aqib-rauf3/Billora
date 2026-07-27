import { IconCheck, IconClock, IconCircleDashed } from "@tabler/icons-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Condensed from docs/ROADMAP.md — same phases, same status, just laid out
// as a page instead of a markdown file so it's linkable from the footer.
const PHASES = [
  { phase: "Phase 1 — Foundation", status: "done", items: ["Public marketing site", "Free tools", "Login/Signup UI"] },
  { phase: "Phase 2 — Dashboard", status: "done", items: ["Dashboard, Invoices, Customers, Estimates, Expenses, Products, Payments, Reports, Notifications — all live on the database"] },
  { phase: "Phase 3 — Invoicing System", status: "active", items: ["Templates, tax, discounts, branded PDF export, payment tracking — done", "Recurring invoices, shareable invoice links — in progress"] },
  { phase: "Phase 4–7 — Customers, Products, Payments, Reports", status: "planned", items: ["Live database", "Online payments", "Financial reports"] },
  { phase: "Phase 8–9 — AI & Automation", status: "planned", items: ["AI invoice generation", "Reminder automation"] },
  { phase: "Phase 10+ — Integrations, Teams, Admin", status: "planned", items: ["Stripe, QuickBooks, Zapier", "Team roles & permissions"] },
];

const STATUS_META = {
  active: { icon: IconClock, label: "In progress", color: "text-amber bg-amberBg" },
  planned: { icon: IconCircleDashed, label: "Planned", color: "text-muted bg-bg" },
  done: { icon: IconCheck, label: "Shipped", color: "text-green bg-greenBg" },
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-ink mb-2">Roadmap</h1>
        <p className="text-sm text-text mb-10">
          Where Billora is headed. This mirrors our internal planning doc — updated as phases move.
        </p>
        <div className="space-y-4">
          {PHASES.map((p) => {
            const meta = STATUS_META[p.status as keyof typeof STATUS_META];
            return (
              <div key={p.phase} className="bg-surface border border-border rounded-lg p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-ink">{p.phase}</p>
                  <span className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${meta.color}`}>
                    <meta.icon size={11} />
                    {meta.label}
                  </span>
                </div>
                <ul className="space-y-1">
                  {p.items.map((it) => (
                    <li key={it} className="text-xs text-muted list-disc ml-4">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
}
