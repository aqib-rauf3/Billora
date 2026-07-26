import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Reflects CHANGELOG.md — a real (if condensed) build history rather than
// marketing copy, per that file's own rule: "never delete previous entries,
// keep chronological."
const ENTRIES = [
  {
    version: "v0.5",
    title: "Dashboard, Sidebar & app shell",
    items: [
      "Sidebar navigation with active-route highlighting + mobile drawer",
      "Dashboard, Invoice History, Create Invoice, Estimates, Expenses, Customer Management pages",
      "Dark mode with system-preference detection",
    ],
  },
  {
    version: "v0.4",
    title: "Free tools & navigation",
    items: [
      "Invoice Generator, Estimate Generator, Receipt Maker (client-side, no signup)",
      "Site-wide Footer + Navbar dropdowns so every page is reachable without typing a URL",
      "Mobile layout pass across every page",
    ],
  },
  {
    version: "v0.1",
    title: "Initial public site",
    items: ["Landing page, Pricing, About, Contact", "Design system, motion system, project documentation"],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-ink mb-8">Changelog</h1>
        <div className="space-y-8">
          {ENTRIES.map((e) => (
            <div key={e.version} className="border-l-2 border-border pl-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono bg-bg border border-border rounded px-2 py-0.5 text-muted">
                  {e.version}
                </span>
                <p className="text-sm font-medium text-ink">{e.title}</p>
              </div>
              <ul className="space-y-1 mt-2">
                {e.items.map((it) => (
                  <li key={it} className="text-xs text-text list-disc ml-4">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
