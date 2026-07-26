"use client";

// Account Settings — reached via the AppTopBar account menu. Three cards:
// Profile (name/business), Security (password change), and Session
// (email on file + sign out). Same card/input conventions as
// invoices/create so it doesn't feel like a bolted-on page.

import { useEffect, useState, type FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  IconUserCircle,
  IconLock,
  IconLogout,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import FadeInSection from "@/components/motion/FadeInSection";

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface disabled:opacity-60 disabled:cursor-not-allowed";
const labelClass = "block text-xs font-medium text-muted mb-1.5";

type Profile = { name: string; email: string; business: string | null };

function Banner({ tone, message }: { tone: "success" | "error"; message: string }) {
  const Icon = tone === "success" ? IconCheck : IconAlertCircle;
  return (
    <div
      className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 mb-4 ${
        tone === "success" ? "text-green bg-greenBg" : "text-red bg-redBg"
      }`}
    >
      <Icon size={14} />
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.user) return;
        setProfile(data.user);
        setName(data.user.name ?? "");
        setBusiness(data.user.business ?? "");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setProfile(data.user);
      await update({ name: data.user.name });
      setProfileMsg({ tone: "success", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ tone: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ tone: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ tone: "error", text: "New passwords don't match." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile?.name ?? name, business: profile?.business ?? business, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg({ tone: "success", text: "Password updated." });
    } catch (err) {
      setPasswordMsg({ tone: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-ink">Account settings</h1>
        <p className="text-sm text-muted mt-1">Manage your profile, business details, and security.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-40 rounded-lg bg-surface border border-border animate-pulse" />
          <div className="h-40 rounded-lg bg-surface border border-border animate-pulse" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Profile */}
          <FadeInSection className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <IconUserCircle size={18} className="text-navy dark:text-[#8FA9E8]" />
              <h2 className="text-sm font-medium text-ink">Profile</h2>
            </div>

            {profileMsg && <Banner tone={profileMsg.tone} message={profileMsg.text} />}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="name">Full name</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input id="email" value={session?.user?.email ?? ""} disabled className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="business">Business name</label>
                <input
                  id="business"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="Optional — shown on your invoices"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-orange text-white rounded-md px-4 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {savingProfile ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </FadeInSection>

          {/* Security */}
          <FadeInSection delay={0.05} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <IconLock size={18} className="text-navy dark:text-[#8FA9E8]" />
              <h2 className="text-sm font-medium text-ink">Security</h2>
            </div>

            {passwordMsg && <Banner tone={passwordMsg.tone} message={passwordMsg.text} />}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="bg-navy text-white rounded-md px-4 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {savingPassword ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          </FadeInSection>

          {/* Session */}
          <FadeInSection delay={0.1} className="bg-surface border border-border rounded-lg p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-medium text-ink">Signed in as</h2>
              <p className="text-sm text-muted mt-1">{session?.user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm text-red border border-red/30 hover:bg-redBg rounded-md px-4 py-2 transition-colors"
            >
              <IconLogout size={15} />
              Sign out
            </button>
          </FadeInSection>
        </div>
      )}
    </div>
  );
}
