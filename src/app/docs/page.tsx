import { IconBook2 } from "@tabler/icons-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Honest placeholder, same reasoning as /api-reference — no fabricated
// documentation for features that aren't built yet.
export default function DocsPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <section className="px-7 py-24 max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-redBg text-orange flex items-center justify-center mx-auto mb-5">
          <IconBook2 size={22} />
        </div>
        <h1 className="text-2xl font-medium text-ink mb-3">Documentation</h1>
        <p className="text-sm text-text max-w-md mx-auto mb-2">
          Full product docs are coming as the app moves off sample data. For now, the free tools
          and every feature page are self-explanatory — no docs needed to try them.
        </p>
        <p className="text-sm text-muted max-w-md mx-auto">
          See the <a href="/roadmap" className="text-navy dark:text-[#8FA9E8] hover:underline">roadmap</a> for what&apos;s next.
        </p>
      </section>
      <Footer />
    </main>
  );
}
