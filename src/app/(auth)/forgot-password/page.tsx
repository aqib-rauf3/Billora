"use client";

// Forgot Password
// Uses AuthShell (see src/components/auth/AuthShell.tsx) for the same
// dark-panel + white-card language as the login page.
//
// No real email provider is configured yet (dev-mode decision) — instead
// of a real email landing in an inbox, /api/auth/forgot-password logs the
// reset link server-side and this page also surfaces it inline (dev-only)
// so the flow is actually testable end-to-end without console access.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconLoader2, IconArrowRight, IconMailCheck } from "@tabler/icons-react";
import AuthShell from "@/components/auth/AuthShell";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3.5 py-2.5 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors";

type Status = "idle" | "loading" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send you a reset link."
    >
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-greenBg flex items-center justify-center mb-4">
              <IconMailCheck size={22} className="text-green" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Check your email</p>
            <p className="text-xs text-muted max-w-[260px] mb-4">
              If an account exists for {email}, a reset link is on its way.
            </p>
            <p className="text-[11px] text-muted bg-bg border border-border rounded-md px-3 py-2 max-w-[280px]">
              Dev mode: no email provider is configured yet — check the server console for the
              reset link.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mb-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="Email address"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red mt-1 overflow-hidden"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-orange to-[#FF7A45] text-white rounded-full py-3 text-sm font-medium mt-6 hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <IconArrowRight size={16} />
              )}
              {status === "loading" ? "Sending..." : "Send reset link"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
