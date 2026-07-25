import FadeInSection from "@/components/motion/FadeInSection";

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Online Invoicing", href: "/features/online-invoicing" },
      { label: "Estimating", href: "/features/estimating" },
      { label: "Expense Tracking", href: "/features/expense-tracking" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Free tools",
    links: [
      { label: "Invoice Generator", href: "/tools/invoice-generator" },
      { label: "Estimate Generator", href: "/tools/estimate-generator" },
      { label: "Receipt Maker", href: "/tools/receipt-maker" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: "/login" },
    ],
  },
];

// Real site-wide footer — every marketing/tool page routes through here so
// pages that aren't in the Navbar (Free tools, Feature pages) are still
// reachable without typing a URL by hand. Reuses the navy footer band
// styling already established by FooterCTA to keep one design language.
export default function Footer() {
  return (
    <FadeInSection>
      <footer className="bg-navy px-7 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] mb-12">
            <div>
              <a href="/" className="flex items-center gap-2 mb-3">
                <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
                <span className="text-lg font-medium text-white tracking-tight">Billora</span>
              </a>
              <p className="text-sm text-[#AEB8E0] leading-relaxed max-w-xs">
                Premium invoicing and billing for freelancers, agencies, and small businesses.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-xs tracking-wide uppercase text-[#7C89C2] mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-[#D7DDF5] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <p className="text-xs text-[#7C89C2]">
              © {new Date().getFullYear()} Billora. All rights reserved.
            </p>
            <a
              href="/login"
              className="bg-orange text-white rounded-md px-5 py-2 text-sm hover:opacity-90 transition-opacity"
            >
              Try it free
            </a>
          </div>
        </div>
      </footer>
    </FadeInSection>
  );
}
