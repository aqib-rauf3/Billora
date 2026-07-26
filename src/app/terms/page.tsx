import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium text-ink mb-2">Terms of Service</h1>
        <p className="text-xs text-muted mb-8">Last updated: July 2026</p>
        <div className="space-y-5 text-sm text-text leading-relaxed">
          <p>
            Billora is still in active development. This page is a placeholder — full terms
            will replace it before general availability.
          </p>
          <p>
            The Starter plan and all three free tools are free to use. Paid plans are billed
            as described on the <a href="/pricing" className="text-navy dark:text-[#8FA9E8] font-medium hover:underline">Pricing page</a>.
            You can cancel at any time from your account settings.
          </p>
          <p>
            Questions? <a href="/contact" className="text-navy dark:text-[#8FA9E8] font-medium hover:underline">Contact us</a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
