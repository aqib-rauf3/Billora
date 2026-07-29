"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconChevronDown } from "@tabler/icons-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

const NAV_LINKS = [
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const FEATURES_LINKS = [
  { label: "Online Invoicing", href: "/features/online-invoicing", desc: "Bill clients in under a minute" },
  { label: "Estimating", href: "/features/estimating", desc: "Quotes that convert to invoices" },
  { label: "Expense Tracking", href: "/features/expense-tracking", desc: "Know where every rupee went" },
];

const TOOLS_LINKS = [
  { label: "Invoice Generator", href: "/tools/invoice-generator", desc: "Free, no signup required" },
  { label: "Estimate Generator", href: "/tools/estimate-generator", desc: "Free, no signup required" },
  { label: "Receipt Maker", href: "/tools/receipt-maker", desc: "Free, no signup required" },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

// Top navbar, shared across the single-page public site ("/" holds every
// marketing section as an anchor) and the standalone marketing/feature pages.
// On "/" the plain links (Pricing/About/Contact) smooth-scroll to the
// section; on any other page they link back to "/#section" so the anchor
// still resolves correctly. "Features" and "Free tools" are dropdowns that
// always deep-link to their own standalone routes, since those pages have
// no anchor equivalent on the homepage.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<"features" | "tools" | null>(null);
  const [mobileMenu, setMobileMenu] = useState<"features" | "tools" | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open dropdown on outside click / Escape (accessibility, per UI_RULES.md)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDesktopMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDesktopMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHome) {
      // Let the browser navigate to "/#section" normally.
      setOpen(false);
      return;
    }
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <div className="sticky top-0 z-50 w-full px-3 sm:px-5 pt-3">
      <nav
        ref={navRef}
        className={`relative mx-auto max-w-5xl flex items-center justify-between gap-4 rounded-full border pl-5 pr-2.5 py-2.5 transition-all duration-300 ${
          scrolled
            ? "bg-surface/45 backdrop-blur-md border-white/20 shadow-[0_8px_30px_-8px_rgba(11,37,69,0.25)]"
            : "bg-surface/20 backdrop-blur-sm border-white/15 shadow-[0_4px_20px_-6px_rgba(11,37,69,0.12)]"
        }`}
      >
      <a
        href={isHome ? "#hero" : "/"}
        onClick={(e) => handleClick(e, "#hero")}
        className="flex items-center gap-2"
      >
        <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
        <span className="text-lg font-medium text-ink tracking-tight">Billora</span>
      </a>

      <div className="hidden md:flex items-center gap-6">
        <NavDropdown
          label="Features"
          items={FEATURES_LINKS}
          isOpenKey="features"
          openMenu={desktopMenu}
          setOpenMenu={setDesktopMenu}
        />

        <a
          href={isHome ? "#pricing" : "/#pricing"}
          onClick={(e) => handleClick(e, "#pricing")}
          className="relative text-sm text-text hover:text-ink transition-colors group"
        >
          Pricing
          <span className="absolute left-0 -bottom-1 h-px w-0 bg-orange transition-all duration-200 group-hover:w-full" />
        </a>

        <NavDropdown
          label="Free tools"
          items={TOOLS_LINKS}
          isOpenKey="tools"
          openMenu={desktopMenu}
          setOpenMenu={setDesktopMenu}
        />

        {NAV_LINKS.filter((l) => l.label !== "Pricing").map((link) => (
          <a
            key={link.href}
            href={isHome ? link.href : `/${link.href}`}
            onClick={(e) => handleClick(e, link.href)}
            className="relative text-sm text-text hover:text-ink transition-colors group"
          >
            {link.label}
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-orange transition-all duration-200 group-hover:w-full" />
          </a>
        ))}

        <ThemeToggle />

        <a
          href="/login"
          className="relative overflow-hidden group/cta bg-navy text-white text-sm rounded-full px-5 py-2.5 hover:bg-navyLight hover:shadow-md hover:-translate-y-px transition-all duration-200"
        >
          <span className="relative z-10">Try it free</span>
          <span
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 -translate-x-[200%] group-hover/cta:translate-x-[400%] transition-transform duration-700 ease-out"
          />
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-ink p-2.5 -mr-1 rounded-full hover:bg-bg transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className="block w-5 h-0.5 bg-navy mb-1" />
        <span className="block w-5 h-0.5 bg-navy mb-1" />
        <span className="block w-5 h-0.5 bg-navy" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-3xl shadow-lg md:hidden flex flex-col p-4 gap-1 max-h-[calc(100vh-96px)] overflow-y-auto"
          >
            <MobileGroup
              label="Features"
              items={FEATURES_LINKS}
              isOpenKey="features"
              openMenu={mobileMenu}
              setOpenMenu={setMobileMenu}
              onNavigate={() => setOpen(false)}
            />

            <a
              href={isHome ? "#pricing" : "/#pricing"}
              onClick={(e) => handleClick(e, "#pricing")}
              className="text-sm text-text px-1 py-2.5"
            >
              Pricing
            </a>

            <MobileGroup
              label="Free tools"
              items={TOOLS_LINKS}
              isOpenKey="tools"
              openMenu={mobileMenu}
              setOpenMenu={setMobileMenu}
              onNavigate={() => setOpen(false)}
            />

            {NAV_LINKS.filter((l) => l.label !== "Pricing").map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-text px-1 py-2.5"
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center justify-between px-1 py-2.5">
              <span className="text-sm text-text">Theme</span>
              <ThemeToggle />
            </div>

            <a
              href="/login"
              className="bg-navy text-white text-sm rounded-full px-4 py-2.5 text-center mt-2"
              onClick={() => setOpen(false)}
            >
              Try it free
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
}

interface DropdownItem {
  label: string;
  href: string;
  desc: string;
}

// Desktop dropdown: click to open (works on touch + keyboard, not just
// hover), closes on outside click / Escape / selection.
function NavDropdown({
  label,
  items,
  isOpenKey,
  openMenu,
  setOpenMenu,
}: {
  label: string;
  items: DropdownItem[];
  isOpenKey: "features" | "tools";
  openMenu: "features" | "tools" | null;
  setOpenMenu: (v: "features" | "tools" | null) => void;
}) {
  const isOpen = openMenu === isOpenKey;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : isOpenKey)}
        aria-expanded={isOpen}
        className="flex items-center gap-1 text-sm text-text hover:text-ink transition-colors"
      >
        {label}
        <IconChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-surface rounded-lg border border-border shadow-lg p-2 origin-top"
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpenMenu(null)}
                className="block rounded-md px-3 py-2.5 hover:bg-bg transition-colors"
              >
                <span className="block text-sm text-ink font-medium">{item.label}</span>
                <span className="block text-xs text-muted mt-0.5">{item.desc}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile accordion version of the same dropdown groups.
function MobileGroup({
  label,
  items,
  isOpenKey,
  openMenu,
  setOpenMenu,
  onNavigate,
}: {
  label: string;
  items: DropdownItem[];
  isOpenKey: "features" | "tools";
  openMenu: "features" | "tools" | null;
  setOpenMenu: (v: "features" | "tools" | null) => void;
  onNavigate: () => void;
}) {
  const isOpen = openMenu === isOpenKey;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : isOpenKey)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between text-sm text-text px-1 py-2.5"
      >
        {label}
        <IconChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden pl-3 flex flex-col"
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="text-sm text-muted py-2"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
