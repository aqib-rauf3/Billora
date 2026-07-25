// Contact Us Page
// Reference mockup: billora_contact_us_page.png
// Reuses ContactSection (already built for the homepage) inside its own
// standalone route so it can be linked/shared/indexed directly.

import Navbar from "@/components/layout/Navbar";
import ContactSection from "@/components/marketing/ContactSection";
import FooterCTA from "@/components/marketing/FooterCTA";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <ContactSection />
      <FooterCTA />
    </main>
  );
}
