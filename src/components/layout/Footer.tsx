"use client";

import { useState } from "react";
import FadeInSection from "@/components/motion/FadeInSection";
import { IconBrandX, IconBrandLinkedin, IconBrandInstagram, IconArrowRight, IconCheck } from "@tabler/icons-react";

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
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "API", href: "/api-reference" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  { icon: IconBrandX, label: "X (Twitter)", href: "https://x.com" },
  { icon: IconBrandLinkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: IconBrandInstagram, label: "Instagram", href: "https://instagram.com" },
];

// Real site-wide footer — every marketing/tool page routes through here so
// pages that aren't in the Navbar (Free tools, Feature pages) are still
// reachable without typing a URL by hand. Reuses the navy footer band
// styling already established by FooterCTA to keep one design language.
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    // TODO: wire to an email list provider (e.g. Resend/Mailchimp) once
    // one is connected — for now this only confirms the form itself works.
    setSubscribed(true);
  };

  return (
    <FadeInSection>
      <footer className="bg-navy px-7 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_0.9fr_0.8fr] mb-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <a href="/" className="flex items-center gap-2 mb-3">
                <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
                <span className="text-lg font-medium text-white tracking-tight">Billora</span>
              </a>
              <p className="text-sm text-[#AEB8E0] leading-relaxed max-w-xs mb-5">
                Premium invoicing and billing for freelancers, agencies, and small businesses.
              </p>

              <p className="text-xs tracking-wide uppercase text-[#7C89C2] mb-2.5">
                Product news, occasionally
              </p>
              {subscribed ? (
                <p className="flex items-center gap-1.5 text-sm text-white">
                  <IconCheck size={15} className="text-orange" />
                  You&apos;re on the list.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5 max-w-xs mb-6">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="min-w-0 flex-1 text-sm bg-white/5 border border-white/15 rounded-md px-3 py-2 text-white placeholder:text-[#7C89C2] outline-none focus:border-orange transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="flex-shrink-0 bg-orange text-white rounded-md px-3 hover:opacity-90 transition-opacity"
                  >
                    <IconArrowRight size={16} />
                  </button>
                </form>
              )}

              <div className="flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-[#8FA0D8] hover:text-white transition-colors"
                  >
                    <s.icon size={17} />
                  </a>
                ))}
              </div>
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
