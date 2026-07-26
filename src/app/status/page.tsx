import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { IconCircleCheck } from "@tabler/icons-react";

// Static status page — no real uptime monitoring exists yet (no
// Statuspage/BetterStack integration), so this honestly reflects that
// rather than faking live incident history.
const SYSTEMS = [
  "Marketing site",
  "Free tools (Invoice / Estimate / Receipt)",
  "Login & signup",
  "App dashboard",
];

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-ink mb-2">System Status</h1>
        <p className="text-sm text-muted mb-8">
          All systems operational. No incidents reported.
        </p>
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {SYSTEMS.map((s) => (
            <div key={s} className="flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0">
              <span className="text-sm text-ink">{s}</span>
              <span className="flex items-center gap-1.5 text-xs text-green">
                <IconCircleCheck size={15} />
                Operational
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          This is a static status page — automated uptime monitoring isn&apos;t wired up yet.
        </p>
      </section>
      <Footer />
    </main>
  );
}
