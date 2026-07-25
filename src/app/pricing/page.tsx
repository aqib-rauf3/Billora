// Pricing Page
// Reference mockup: billora_pricing_page.png
// Reuses PricingSection (already built for the homepage) inside its own
// standalone route so it can be linked/shared/indexed directly.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/marketing/PricingSection";
import FooterCTA from "@/components/marketing/FooterCTA";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <PricingSection />
      <FooterCTA />
      <Footer />
    </main>
  );
}
