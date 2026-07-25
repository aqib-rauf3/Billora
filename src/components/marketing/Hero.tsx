import FadeInSection from "@/components/motion/FadeInSection";

// Hero section — Reference: billora_landing_page_v2.html hero
export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-20 grid md:grid-cols-2 gap-8 px-7 py-16 md:py-24 items-center max-w-6xl mx-auto">
      <FadeInSection>
        <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4">
          AI-powered line items
        </span>
        <h1 className="text-3xl md:text-[34px] leading-tight font-medium text-navy mb-4">
          Invoicing that writes
          <br />
          itself, almost.
        </h1>
        <p className="text-sm md:text-[15px] text-text leading-relaxed mb-6 max-w-md">
          Type a rough line item, get a polished invoice. Track paid and unpaid bills in one place.
        </p>
        <div className="flex gap-3">
          <a href="/login" className="bg-navy text-white rounded-md px-6 py-3 text-sm hover:bg-navyLight transition-colors">
            Create your first invoice
          </a>
          <a href="#features" className="bg-white border border-[#C7D2F0] text-navy rounded-md px-6 py-3 text-sm hover:bg-bg transition-colors">
            See a demo
          </a>
        </div>
      </FadeInSection>

      <FadeInSection delay={0.15}>
        <div className="bg-white rounded-xl p-5 relative shadow-sm">
          <div className="flex justify-between items-center mb-3.5">
            <span className="text-sm font-medium text-navy">Northline Traders</span>
            <span className="text-xs bg-greenBg text-green px-2.5 py-0.5 rounded-full">Paid</span>
          </div>
          <div className="border-y border-[#EEF1FB] py-3 mb-3 space-y-2">
            <div className="flex justify-between text-xs text-text">
              <span>Landing page redesign</span>
              <span className="font-mono">45,000</span>
            </div>
            <div className="flex justify-between text-xs text-text">
              <span>API integration (x6)</span>
              <span className="font-mono">21,000</span>
            </div>
          </div>
          <div className="flex justify-between text-base font-medium text-navy">
            <span>Total</span>
            <span className="font-mono">Rs. 69,300</span>
          </div>
          <div className="absolute -top-2.5 -right-2.5 bg-orange text-white text-xs px-2.5 py-1.5 rounded-lg">
            ✨ polished
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
