"use client";

// Account dropdown for the AppTopBar avatar button. Previously that button
// had no onClick at all — this is what wires it up: a small popover with
// the signed-in user's name/email, a link into the full Account Settings
// page, and Sign out. Closes on outside click, Escape, and route change.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { IconUserCircle, IconSettings, IconLogout, IconChevronDown } from "@tabler/icons-react";

function initials(name?: string | null) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function AccountMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 text-muted hover:text-ink transition-colors rounded-full"
      >
        {name ? (
          <span className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-navy text-white text-[10px] font-medium leading-none dark:bg-navyLight">
            {initials(name)}
          </span>
        ) : (
          <IconUserCircle size={22} />
        )}
        <IconChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] w-60 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-ink truncate">{name || "Your account"}</p>
              <p className="text-xs text-muted truncate mt-0.5">{email}</p>
            </div>

            <div className="p-1.5">
              <a
                href="/settings"
                role="menuitem"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-ink hover:bg-bg transition-colors"
              >
                <IconSettings size={16} className="text-muted" />
                Account settings
              </a>
              <button
                type="button"
                role="menuitem"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-red hover:bg-redBg transition-colors"
              >
                <IconLogout size={16} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
