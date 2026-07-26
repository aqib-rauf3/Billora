import { IconCode } from "@tabler/icons-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Honest placeholder — the internal API routes exist (src/app/api/*) but
// are still TODO stubs (see Billora_Feature_Status_Checklist), so there's
// no real public API to document yet. This says so plainly rather than
// faking reference docs for endpoints that don't work.
export default function ApiReferencePage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-24 max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-redBg text-orange flex items-center justify-center mx-auto mb-5">
          <IconCode size={22} />
        </div>
        <h1 className="text-2xl font-medium text-ink mb-3">API reference</h1>
        <p className="text-sm text-text max-w-md mx-auto mb-2">
          Billora&apos;s public API isn&apos;t live yet — our internal endpoints are still being
          connected to a database.
        </p>
        <p className="text-sm text-muted max-w-md mx-auto">
          Want early access once it ships? <a href="/contact" className="text-navy dark:text-[#8FA9E8] hover:underline">Get in touch</a>.
        </p>
      </section>
      <Footer />
    </main>
  );
}
