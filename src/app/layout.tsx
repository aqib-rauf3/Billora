import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
