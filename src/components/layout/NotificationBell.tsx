"use client";

// Bell icon dropdown in AppTopBar (Phase 2 module — Notifications). Polls
// /api/notifications on an interval so the unread badge stays roughly
// current without needing websockets. Clicking a notification marks it
// read and follows its `link` (e.g. to the overdue invoice); "Mark all
// read" hits the bulk PATCH endpoint. Same open/close/outside-click
// pattern as AccountMenu, so the two dropdowns behave identically.

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconBell, IconCheck, IconFileInvoice, IconCash, IconSparkles } from "@tabler/icons-react";
import type { LiveNotification, NotificationType } from "@/lib/liveData";

const POLL_MS = 60_000;

const ICONS: Record<NotificationType, typeof IconBell> = {
  welcome: IconSparkles,
  payment_received: IconCash,
  invoice_overdue: IconFileInvoice,
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<LiveNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const body = await res.json();
        setItems(body.notifications ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

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

  const unreadCount = items.filter((n) => !n.read).length;

  const handleItemClick = async (n: LiveNotification) => {
    if (!n.read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      fetch(`/api/notifications/${n.id}`, { method: "PATCH" }).catch(() => {});
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    await fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex items-center justify-center w-8 h-8 text-muted hover:text-ink transition-colors rounded-full"
      >
        <IconBell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-orange" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] w-80 max-h-[420px] overflow-y-auto bg-surface border border-border rounded-lg shadow-xl z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-surface">
              <p className="text-sm font-medium text-ink">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-navy dark:text-[#8FA9E8] hover:underline"
                >
                  <IconCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-bg rounded-md animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <IconBell size={20} className="text-muted mx-auto mb-2" />
                <p className="text-xs text-muted">You&apos;re all caught up.</p>
              </div>
            ) : (
              <div className="p-1.5">
                {items.map((n) => {
                  const Icon = ICONS[n.type] ?? IconBell;
                  return (
                    <button
                      key={n.id}
                      role="menuitem"
                      onClick={() => handleItemClick(n)}
                      className={`w-full flex items-start gap-2.5 px-2.5 py-2.5 rounded-md text-left transition-colors hover:bg-bg ${
                        n.read ? "" : "bg-orange/5"
                      }`}
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-bg flex-shrink-0 mt-0.5">
                        <Icon size={14} className="text-navy dark:text-[#8FA9E8]" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-xs leading-snug ${n.read ? "text-text" : "text-ink font-medium"}`}>
                          {n.message}
                        </span>
                        <span className="block text-[11px] text-muted mt-0.5">{timeAgo(n.createdAt)}</span>
                      </span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0 mt-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
