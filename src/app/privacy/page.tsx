import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Minimal real page rather than a dead footer link — placeholder legal
// copy until Billora has actual counsel-reviewed terms.
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-ink mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted mb-8">Last updated: July 2026</p>
        <div className="space-y-5 text-sm text-text leading-relaxed">
          <p>
            Billora is still in active development. This page is a placeholder — a full,
            counsel-reviewed privacy policy will replace it before general availability.
          </p>
          <p>
            In short: we only collect what&apos;s needed to run your account (name, email,
            invoice/customer data you enter), we don&apos;t sell it, and the free tools
            (Invoice Generator, Estimate Generator, Receipt Maker) never send your data
            anywhere — they run entirely in your browser.
          </p>
          <p>
            Questions in the meantime? <a href="/contact" className="text-navy dark:text-[#8FA9E8] font-medium hover:underline">Contact us</a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
