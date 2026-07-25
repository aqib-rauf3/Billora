// Single-page public site — Landing + Features + Pricing + About + Contact
// all live here as scrollable sections with smooth anchor navigation (see Navbar)
// and scroll-in animations (see FadeInSection). Reference mockups:
// billora_landing_page_v2.html, billora_pricing_page.html, billora_about_us_page.html,
// billora_contact_us_page.html, billora_online_invoicing_page.html,
// billora_estimating_page.html, billora_expense_tracking_page.html

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/marketing/Hero";
import StatsStrip from "@/components/marketing/StatsStrip";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import PricingSection from "@/components/marketing/PricingSection";
import AboutSection from "@/components/marketing/AboutSection";
import ContactSection from "@/components/marketing/ContactSection";
import FooterCTA from "@/components/marketing/FooterCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <StatsStrip />
      <FeaturesGrid />
      <PricingSection />
      <AboutSection />
      <ContactSection />
      <FooterCTA />
    </main>
  );
}
