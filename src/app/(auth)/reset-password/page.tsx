"use client";

// Reset Password
// Reads the token from the reset link's query string (?token=...), lets
// the user set a new password, then sends them back to /login.

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLoader2,
  IconArrowRight,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconAlertTriangle,
} from "@tabler/icons-react";
import AuthShell from "@/components/auth/AuthShell";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3.5 py-2.5 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors";

type Status = "idle" | "loading" | "success" | "error";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      setStatus("error");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account.">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-greenBg flex items-center justify-center mb-4">
              <IconCheck size={24} className="text-green" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Password updated</p>
            <p className="text-xs text-muted max-w-[260px] mb-4">
              You can now sign in with your new password.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-1.5 text-sm text-navy dark:text-[#8FA9E8] font-medium hover:underline"
            >
              Go to login
              <IconArrowRight size={14} />
            </button>
          </motion.div>
        ) : !token ? (
          <motion.div
            key="no-token"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-redBg flex items-center justify-center mb-4">
              <IconAlertTriangle size={22} className="text-red" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Invalid reset link</p>
            <p className="text-xs text-muted max-w-[260px] mb-4">
              This link is missing its token. Request a new one from the forgot password page.
            </p>
            <a
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm text-navy dark:text-[#8FA9E8] font-medium hover:underline"
            >
              Request new link
              <IconArrowRight size={14} />
            </a>
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
            <div className="mb-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-ink transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red mt-2 overflow-hidden"
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
              {status === "loading" ? "Updating..." : "Update password"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
