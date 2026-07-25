import FadeInSection from "@/components/motion/FadeInSection";

// Closing CTA band — reused pattern seen at the bottom of every marketing mockup
export default function FooterCTA() {
  return (
    <FadeInSection>
      <section className="bg-navy px-7 py-10 text-center">
        <p className="text-lg font-medium text-white mb-1.5">
          Join 40,000+ freelancers billing smarter
        </p>
        <p className="text-sm text-[#AEB8E0] mb-4.5">No credit card required. Cancel anytime.</p>
        <a
          href="/login"
          className="inline-block bg-orange text-white rounded-md px-6 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          Try it free
        </a>
      </section>
    </FadeInSection>
  );
}
