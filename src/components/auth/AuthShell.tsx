"use client";

// Shared shell for the secondary auth screens (Forgot Password, Reset
// Password, Verify Email) — reuses the exact dark-panel + white-card
// language and color values from src/app/(auth)/login/page.tsx (the only
// design-reference we have for auth, billora_login_signup_page.png) so
// these read as the same product, not a bolted-on template.
//
// Deliberately lighter than the login page: no 3D phone mockup. These are
// secondary/utility screens a user passes through quickly, not the "hero"
// first-impression screen — same pattern Stripe/Linear use (simple centered
// card for password-recovery flows vs. the full marketing-style login).

import { motion } from "framer-motion";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center md:p-8">
      <div className="w-full md:max-w-4xl bg-surface md:rounded-[28px] md:shadow-2xl md:border md:border-border overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-0">
        {/* Dark branded panel — same background/blur treatment as login */}
        <div className="relative md:w-[42%] bg-[#28211F] px-7 py-8 md:p-11 flex flex-col justify-between overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-orange/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-56 h-56 rounded-full bg-[#4A3A2E]/30 blur-3xl" />

          <div className="relative">
            <a href="/" className="inline-flex items-center gap-2">
              <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
              <span className="text-lg font-medium text-white tracking-tight">Billora</span>
            </a>
            <p className="hidden md:block text-xs text-[#8A8680] mt-8 max-w-[220px] leading-relaxed">
              Invoicing made simple — professional invoices, in minutes.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden md:block"
          >
            <h2 className="text-[26px] leading-[1.15] font-medium text-white max-w-[260px]">
              {title}
            </h2>
          </motion.div>

          <p className="hidden md:block relative text-xs text-[#6E6A63]">
            Trusted by 40,000+ freelancers and agencies.
          </p>
        </div>

        {/* White content panel */}
        <div className="flex-1 flex flex-col bg-surface px-7 py-6 md:p-11">
          <div className="flex items-center justify-end mb-10 md:mb-16">
            <a href="/login" className="text-sm text-muted hover:text-ink transition-colors">
              Back to login
            </a>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[340px] w-full mx-auto md:mx-0">
            {eyebrow && (
              <span className="inline-block bg-redBg text-red text-xs px-3 py-1 rounded-full mb-4 w-fit">
                {eyebrow}
              </span>
            )}
            <h1 className="text-[26px] font-medium text-ink mb-2 md:hidden">{title}</h1>
            {subtitle && <p className="text-sm text-muted mb-7">{subtitle}</p>}
            {children}
          </div>

          <div className="flex items-center justify-between mt-10 md:mt-0 pt-6 text-[11px] text-muted">
            <span>© 2026 Billora Inc.</span>
            <div className="flex items-center gap-4">
              <a href="/#contact" className="hover:text-ink transition-colors">
                Contact Us
              </a>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
