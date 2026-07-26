import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import AuthProvider from "@/components/layout/AuthProvider";
import ConditionalNeonGlow from "@/components/marketing/ConditionalNeonGlow";

export const metadata: Metadata = {
  title: "Billora — Invoicing for freelancers",
  description: "Create invoices, estimates, and track expenses in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required by next-themes: it sets the
    // `class` attribute on <html> before React hydrates (to avoid a
    // light-mode flash for dark-mode users), which otherwise triggers a
    // harmless server/client mismatch warning on this one attribute.
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-bg text-text">
        <ThemeProvider>
          <AuthProvider>
            <ConditionalNeonGlow />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
