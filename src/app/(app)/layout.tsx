"use client";

// App shell layout — wraps Dashboard, Invoices, Estimates, Expenses,
// Customers. Reference: sidebar nav seen in all billora_*_page.png app
// screens (Billora logo, Dashboard/Invoices/Estimates/Expenses/Customers/
// Reports links).
//
// Structure: Sidebar (desktop fixed column / mobile drawer) + AppTopBar
// (mobile hamburger, desktop theme/account) + scrollable content area.
// The mobile drawer's open state lives here since both the topbar (which
// opens it) and the sidebar (which renders it) need it.

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AppTopBar from "@/components/layout/AppTopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopBar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
