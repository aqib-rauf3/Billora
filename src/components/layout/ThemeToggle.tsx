"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";

const OPTIONS = [
  { value: "light", label: "Light", icon: IconSun },
  { value: "system", label: "System", icon: IconDeviceDesktop },
  { value: "dark", label: "Dark", icon: IconMoon },
] as const;

// Three-way Light / System / Dark switch. "System" follows the OS
// prefers-color-scheme automatically (next-themes handles the media-query
// listener); picking Light or Dark explicitly overrides it and is
// remembered for next visit.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme isn't known on the server, so avoid rendering the active state
  // until after hydration to prevent a mismatch flash.
  useEffect(() => setMounted(true), []);

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={`inline-flex items-center gap-0.5 bg-bg border border-border rounded-full p-1 ${className}`}
    >
      {OPTIONS.map((opt) => {
        const isActive = mounted && (theme ?? "system") === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setTheme(opt.value)}
            className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200 ${
              isActive
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            <opt.icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
