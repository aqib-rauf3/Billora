"use client";

// Slim chrome bar that sits above every (app) page's content.
// - Mobile: shows the hamburger that opens the Sidebar drawer (the sidebar
//   itself is hidden below md), plus the Billora mark so there's still a
//   sense of place with the drawer closed.
// - Desktop: sidebar already carries the logo/nav, so this bar is just a
//   slim strip for cross-page utilities (theme toggle, account) that
//   shouldn't live inside page content itself.

import ThemeToggle from "@/components/layout/ThemeToggle";
import { IconMenu2, IconUserCircle } from "@tabler/icons-react";

export default function AppTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-border bg-surface">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="md:hidden p-1.5 -ml-1.5 text-ink"
      >
        <IconMenu2 size={20} />
      </button>

      <div className="flex items-center gap-2 md:hidden">
        <span className="inline-block w-3 h-5 border-2 border-orange border-r-0" />
        <span className="text-sm font-medium text-ink">Billora</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          aria-label="Account"
          className="text-muted hover:text-ink transition-colors"
        >
          <IconUserCircle size={22} />
        </button>
      </div>
    </header>
  );
}
