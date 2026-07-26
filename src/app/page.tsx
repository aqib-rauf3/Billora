// Single-page public site — Landing + Features + Pricing + About + Contact
// all live here. Hero / Stats / Features / About / Cases use the sticky
// stacked-card scroll effect (see StackedPanel) inspired by the uploaded
// reference video; Pricing / Contact / Footer stay in normal document flow
// since a pinned scroll-jacked table or form hurts usability (see
// UI_RULES.md "usability over decoration"). Reference mockups:
// billora_landing_page_v2.html, billora_pricing_page.html, billora_about_us_page.html,
// billora_contact_us_page.html, billora_online_invoicing_page.html,
// billora_estimating_page.html, billora_expense_tracking_page.html

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/marketing/PageLoader";
import StackedPanel from "@/components/motion/StackedPanel";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Hero from "@/components/marketing/Hero";
import LogoCloud from "@/components/marketing/LogoCloud";
import StatsStrip from "@/components/marketing/StatsStrip";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import ProductDashboardPreview from "@/components/marketing/ProductDashboardPreview";
import CasesSection from "@/components/marketing/CasesSection";
import FreeToolsStrip from "@/components/marketing/FreeToolsStrip";
import Testimonials from "@/components/marketing/Testimonials";
import PricingSection from "@/components/marketing/PricingSection";
import FAQSection from "@/components/marketing/FAQSection";
import AboutSection from "@/components/marketing/AboutSection";
import ContactSection from "@/components/marketing/ContactSection";
import FooterCTA from "@/components/marketing/FooterCTA";
import StickyCTA from "@/components/marketing/StickyCTA";

const PANELS = [
  { id: "hero", label: "Home" },
  { id: "stats", label: "Numbers" },
  { id: "features", label: "Features" },
  { id: "about", label: "About" },
  { id: "cases", label: "Cases" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <PageLoader />
      <Navbar />
      <ScrollProgress items={PANELS} />

      {/* Stacked scroll sequence */}
      <StackedPanel id="hero" index={1} roundedTop={false}>
        <Hero />
      </StackedPanel>
      <StackedPanel id="stats" index={2} bufferVh={4}>
        <LogoCloud />
        <StatsStrip />
      </StackedPanel>
      <StackedPanel id="features" index={3}>
        <FeaturesGrid />
        <ProductDashboardPreview />
      </StackedPanel>
      <StackedPanel id="about" index={4}>
        <AboutSection />
      </StackedPanel>
      <StackedPanel id="cases" index={5} bufferVh={8}>
        <CasesSection />
      </StackedPanel>

      {/* Normal scroll flow — forms/tables shouldn't be scroll-jacked */}
      <div className="relative bg-bg" style={{ zIndex: 6 }}>
        <FreeToolsStrip />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <ContactSection />
        <FooterCTA />
        <Footer />
      </div>

      <StickyCTA />
    </main>
  );
}
