"use client";

// Login / Signup Page
// Reference: user-provided screenshot of a Payoneer-style split login screen
// (dark branded panel + white minimal form, floating rounded card, gradient
// pill CTA, footer bar). Rebuilt to match that layout and color treatment
// almost exactly, with Billora's own branding, wordmark, and orange accent
// dropped in, and the phone mockup showing a Billora dashboard preview
// instead of a balance screen. On mobile the dark panel (with the phone
// mockup) stacks above the form instead of disappearing, so the "Billora
// dashboard on a phone" visual stays visible on small screens too.
//
// Auth logic: real now. Signup POSTs to /api/auth/signup (Prisma + bcrypt),
// then both signup and login hand off to next-auth's
// signIn("credentials", ...) — see src/lib/auth.ts.
//
// Phone mockup: upgraded from a CSS-only mockup to the real 3D model
// (public/models/iphone-17-pro-max.glb) rendered with react-three-fiber.
// The model's screen material originally showed a stock wallpaper photo —
// src/components/Phone3D.tsx swaps that texture for a generated Billora
// dashboard image (public/screens/dashboard-screen.png) instead, so the
// phone now shows our product. Loaded via next/dynamic with ssr:false
// (WebGL needs the browser) and a skeleton fallback while it loads, per
// MOTION_SYSTEM.md's "skeleton loaders preferred, avoid blank pages" rule.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  IconLoader2,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconArrowRight,
} from "@tabler/icons-react";

const Phone3D = dynamic(() => import("@/components/Phone3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-[32px] bg-gradient-to-b from-[#3A342C]/60 to-[#221D18]/60 animate-pulse" />
  ),
});

const inputClass =
  "w-full text-sm border border-border rounded-md px-3.5 py-2.5 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors";
const labelClass = "text-xs text-text block mb-1.5";

type Mode = "login" | "signup";
type Status = "idle" | "loading" | "success" | "error";

export default function LoginSignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const switchMode = (next: Mode) => {
    setMode(next);
    setStatus("idle");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");

    try {
      // Signup first creates the User row (hashed password, via Prisma) —
      // then, either way, next-auth's own credentials flow does the actual
      // sign-in and sets the session cookie. See src/lib/auth.ts and
      // src/app/api/auth/signup/route.ts.
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Something went wrong. Please try again.");
          setStatus("error");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          mode === "signup"
            ? "Account created — but sign-in failed. Try logging in below."
            : "Incorrect email or password."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  };

  // There's no real session yet (backend is still a TODO stub), but the
  // app shell (Sidebar/AppTopBar) is built — so once the form itself has
  // validated and "succeeded", send the user straight into the app instead
  // of leaving them stranded on a static success message. Short delay so
  // the checkmark is actually seen before the page changes; the button
  // below lets an impatient user skip the wait.
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => router.push("/dashboard"), 1400);
    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center md:p-8">
      <div className="w-full md:max-w-5xl bg-surface md:rounded-[28px] md:shadow-2xl md:border md:border-border overflow-hidden flex flex-col md:flex-row min-h-screen md:min-h-0">
        {/* Dark branded panel — Billora equivalent of the reference's dark
            "manage your money" panel. Background color sampled directly from
            the reference screenshot (#28211F) for an exact match. Fixed dark
            tone (not the theme-toggled surface) so the phone mockup's
            contrast never breaks. */}
        <div className="relative md:w-[46%] bg-[#28211F] px-7 py-8 md:p-11 flex flex-col justify-between overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-orange/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-56 h-56 rounded-full bg-[#4A3A2E]/30 blur-3xl" />

          <div className="relative flex items-center justify-between md:block">
            <a href="/" className="inline-flex items-center gap-2">
              <span className="inline-block w-3.5 h-6 border-2 border-orange border-r-0" />
              <span className="text-lg font-medium text-white tracking-tight">Billora</span>
            </a>
            <p className="hidden md:block text-xs text-[#8A8680] mt-8 max-w-[220px] leading-relaxed">
              Invoicing made simple — professional invoices, in minutes.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center md:items-start md:block my-8 md:my-0"
          >
            <h1 className="text-[26px] leading-tight md:text-[38px] md:leading-[1.1] font-medium text-white mb-6 md:mb-10 text-center md:text-left max-w-[300px]">
              Manage your invoices
            </h1>

            {/* Phone mockup — real 3D model (public/models/iphone-17-pro-max.glb)
                rendered with react-three-fiber, held at the same angle the
                CSS version used (rotateY -22deg / rotateX 4deg) to match the
                reference photo's phone-in-hand turn. The model's screen
                material shows the Billora dashboard instead of its stock
                wallpaper — see src/components/Phone3D.tsx for the texture
                swap. Wrapper sizing/entrance animation kept identical to
                before so the rest of the panel didn't need to change. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative w-[210px] mx-auto"
            >
              {/* soft grounded shadow beneath the phone — skewed to match
                  the model's turn */}
              <div
                className="absolute -bottom-3 left-[46%] -translate-x-1/2 w-24 h-6 rounded-full bg-black/50 blur-xl"
                style={{ transform: "rotateZ(-6deg) scaleX(1.15)" }}
              />

              <div className="relative w-[178px] aspect-[9/19] mx-auto">
                <Phone3D />
              </div>
            </motion.div>
          </motion.div>

          <p className="hidden md:block relative text-xs text-[#6E6A63]">
            Trusted by 40,000+ freelancers and agencies.
          </p>
        </div>

        {/* White form panel */}
        <div className="flex-1 flex flex-col bg-surface px-7 py-6 md:p-11">
          <div className="flex items-center justify-end mb-10 md:mb-16">
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[340px] w-full mx-auto md:mx-0">
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
                  <p className="text-sm font-medium text-ink mb-1">
                    {mode === "login" ? "Logged in" : "Account created"}
                  </p>
                  <p className="text-xs text-muted max-w-[260px] mb-4">
                    Taking you to your dashboard&hellip;
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center gap-1.5 text-sm text-navy dark:text-[#8FA9E8] font-medium hover:underline"
                  >
                    Go now
                    <IconArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <h2 className="text-[26px] font-medium text-ink mb-7">
                    {mode === "login" ? "Sign In" : "Sign Up"}
                  </h2>

                  {mode === "signup" && (
                    <div className="mb-4">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        placeholder="Full name"
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="Email or Username"
                    />
                  </div>

                  <div className="mb-1">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                        placeholder="Password"
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

                  {mode === "login" && (
                    <a href="#" className="text-xs text-orange hover:underline">
                      Forgot password?
                    </a>
                  )}

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
                    {status === "loading"
                      ? mode === "login"
                        ? "Signing in..."
                        : "Creating account..."
                      : mode === "login"
                        ? "Sign In"
                        : "Sign Up"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-10 md:mt-0 pt-6 text-[11px] text-muted">
            <span>© 2026 Billora Inc.</span>
            <div className="flex items-center gap-4">
              <a href="/#contact" className="hover:text-ink transition-colors">
                Contact Us
              </a>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
