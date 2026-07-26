"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// Reusable modal per COMPONENT_GUIDE.md's spec: header, content, footer,
// close action, Escape key support, backdrop-click support. Used by the
// "Add customer" and "Add expense" quick-add flows.
export default function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-[420px] bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 id="modal-title" className="text-sm font-medium text-ink">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1 text-muted hover:text-ink transition-colors"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="px-5 py-4">{children}</div>

            {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
