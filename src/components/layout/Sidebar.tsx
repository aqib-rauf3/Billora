"use client";

// Sidebar nav for the app shell (used inside (app)/layout.tsx).
// Reference: navy sidebar with Billora logo + Dashboard/Invoices/Estimates/
// Expenses/Customers/Reports links, seen across billora_dashboard_page.png,
// billora_invoice_history_page.png, etc.
//
// Stays bg-navy in both light and dark theme (Sidebar is one of the static
// brand surfaces per tailwind.config.ts, same as the Footer/CTA bands) so
// switching theme never makes the app feel like two different products.
//
// Desktop: fixed-width column, always visible.
// Mobile: collapses into a slide-in drawer, opened from the AppTopBar
// hamburger — state is lifted to AppShell so the topbar can control it.

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconLayoutDashboard,
  IconFileInvoice,
  IconClipboardText,
  IconReceipt2,
  IconUsers,
  IconChartBar,
  IconBox,
  IconCash,
  IconX,
} from "@tabler/icons-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
  { label: "Estimates", href: "/estimates", icon: IconClipboardText },
  { label: "Expenses", href: "/expenses", icon: IconReceipt2 },
  { label: "Customers", href: "/customers", icon: IconUsers },
  { label: "Products", href: "/products", icon: IconBox },
  { label: "Payments", href: "/payments", icon: IconCash },
  { label: "Reports", href: "/reports", icon: IconChartBar },
];

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 px-2">
      <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
      <span className="text-lg font-medium text-white tracking-tight">Billora</span>
    </a>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        // "/invoices" should also stay highlighted on "/invoices/create".
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              active
                ? "bg-white/10 text-white font-medium"
                : "text-[#AEB8E0] hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon
              size={17}
              className={active ? "text-orange" : "text-[#7C89C2] group-hover:text-orange transition-colors"}
            />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop: fixed column, always visible */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-navy min-h-screen flex-col gap-6 p-4 sticky top-0">
        <div className="pt-2">
          <Logo />
        </div>
        <NavLinks />
      </aside>

      {/* Mobile: slide-in drawer + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-y-0 left-0 w-[260px] bg-navy flex flex-col gap-6 p-4 z-50"
            >
              <div className="flex items-center justify-between pt-2">
                <Logo />
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-1.5 text-[#AEB8E0] hover:text-white transition-colors"
                >
                  <IconX size={18} />
                </button>
              </div>
              <NavLinks onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
