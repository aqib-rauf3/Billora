"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// Wraps the app so every page can read/set the color theme. attribute="class"
// toggles the `.dark` class on <html>, which every CSS variable in
// globals.css (and therefore every bg-bg / text-ink / bg-surface / etc.
// utility across the app) reacts to. defaultTheme="light" means every
// first-time visitor gets Billora's light theme regardless of their OS
// setting. enableSystem stays on so the toggle's "System" option still
// works if the user explicitly picks it — but it's opt-in, not the
// default anymore. Any explicit choice (Light/System/Dark) is remembered
// via localStorage after that.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
