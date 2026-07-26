"use client";

// Verify Email
// Two states share this one route:
//  - ?token=... — a link just clicked from the verification email; this
//    page calls /api/auth/verify-email, then refreshes the session (so
//    middleware.ts stops blocking the app) and redirects to /dashboard.
//  - no token (?pending=1, or landed here directly) — the signed-in but
//    unverified "check your email" screen, with a resend action. This is
//    where middleware.ts sends anyone who tries the app before verifying.

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLoader2,
  IconCheck,
  IconAlertTriangle,
  IconMailCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import AuthShell from "@/components/auth/AuthShell";

type Status = "verifying" | "verified" | "error";
type ResendStatus = "idle" | "sending" | "sent" | "error";

function VerifyingView({ token }: { token: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error ?? "This verification link is invalid.");
          setStatus("error");
          return;
        }

        // Refresh the JWT so middleware sees emailVerified: true without a
        // re-login, then move on to the dashboard.
        await update({ emailVerified: true });
        setStatus("verified");
        setTimeout(() => router.push("/dashboard"), 1200);
      } catch {
        if (!cancelled) {
          setError("Something went wrong. Please check your connection and try again.");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthShell title="Verifying your email" subtitle="One moment while we confirm your link.">
      <AnimatePresence mode="wait">
        {status === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center py-6"
          >
            <IconLoader2 size={28} className="animate-spin text-navy dark:text-[#8FA9E8] mb-4" />
            <p className="text-sm text-muted">Confirming your email…</p>
          </motion.div>
        )}
        {status === "verified" && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-greenBg flex items-center justify-center mb-4">
              <IconCheck size={24} className="text-green" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Email verified</p>
            <p className="text-xs text-muted max-w-[260px]">Taking you to your dashboard…</p>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-redBg flex items-center justify-center mb-4">
              <IconAlertTriangle size={22} className="text-red" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">Verification failed</p>
            <p className="text-xs text-muted max-w-[260px] mb-4">{error}</p>
            <a
              href="/verify-email?pending=1"
              className="inline-flex items-center gap-1.5 text-sm text-navy dark:text-[#8FA9E8] font-medium hover:underline"
            >
              Request a new link
              <IconArrowRight size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}

function PendingView() {
  const { data: session } = useSession();
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    setResendStatus("sending");
    setResendError("");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setResendError(data.error ?? "Something went wrong. Please try again.");
        setResendStatus("error");
        return;
      }
      setResendStatus("sent");
    } catch {
      setResendError("Something went wrong. Please check your connection and try again.");
      setResendStatus("error");
    }
  };

  return (
    <AuthShell
      eyebrow="One more step"
      title="Verify your email"
      subtitle={
        session?.user?.email
          ? `We sent a verification link to ${session.user.email}.`
          : "We sent you a verification link — check your inbox."
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-12 h-12 rounded-full bg-redBg flex items-center justify-center mb-4">
          <IconMailCheck size={22} className="text-red" />
        </div>
        <p className="text-xs text-muted max-w-[280px] mb-5">
          Click the link in that email to unlock your dashboard. Didn&apos;t get it?
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendStatus === "sending"}
          className="w-full bg-gradient-to-r from-orange to-[#FF7A45] text-white rounded-full py-3 text-sm font-medium hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 mb-3"
        >
          {resendStatus === "sending" && <IconLoader2 size={16} className="animate-spin" />}
          {resendStatus === "sending" ? "Sending..." : "Resend verification email"}
        </button>

        <AnimatePresence>
          {resendStatus === "sent" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-green overflow-hidden"
            >
              Sent — check the server console for the dev-mode link.
            </motion.p>
          )}
          {resendStatus === "error" && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red overflow-hidden"
            >
              {resendError}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-muted hover:text-ink transition-colors mt-4"
        >
          Sign out
        </button>
      </div>
    </AuthShell>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) return <VerifyingView token={token} />;
  return <PendingView />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
