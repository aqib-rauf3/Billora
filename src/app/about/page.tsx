// About Us Page
// Reference mockup: billora_about_us_page.png
// Reuses AboutSection (already built for the homepage) inside its own
// standalone route so it can be linked/shared/indexed directly.

import Navbar from "@/components/layout/Navbar";
import AboutSection from "@/components/marketing/AboutSection";
import FooterCTA from "@/components/marketing/FooterCTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <AboutSection />
      <FooterCTA />
    </main>
  );
}
