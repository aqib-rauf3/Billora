"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Top navbar for the single-page public site (Landing/Features/Pricing/About/Contact
// all live as sections on "/" — this nav just smooth-scrolls to each anchor).
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-7 py-4 bg-white/90 backdrop-blur border-b border-border">
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("#hero");
        }}
        className="flex items-center gap-2"
      >
        <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
        <span className="text-lg font-medium text-navy tracking-tight">Billora</span>
      </a>

      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(link.href);
            }}
            className="text-sm text-text hover:text-navy transition-colors"
          >
            {link.label}
          </a>
        ))}
        <a
          href="/login"
          className="bg-navy text-white text-sm rounded-md px-4 py-2 hover:bg-navyLight transition-colors"
        >
          Try it free
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-navy"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span className="block w-5 h-0.5 bg-navy mb-1" />
        <span className="block w-5 h-0.5 bg-navy mb-1" />
        <span className="block w-5 h-0.5 bg-navy" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-border md:hidden flex flex-col p-4 gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className="text-sm text-text"
            >
              {link.label}
            </a>
          ))}
          <a href="/login" className="bg-navy text-white text-sm rounded-md px-4 py-2 text-center">
            Try it free
          </a>
        </div>
      )}
    </nav>
  );
}
