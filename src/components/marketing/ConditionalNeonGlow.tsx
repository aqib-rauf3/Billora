"use client";

import { usePathname } from "next/navigation";
import NeonEdgeGlow from "./NeonEdgeGlow";

// Marketing pages only — dashboard, invoices, customers, estimates,
// expenses, and login are excluded so app/auth pages stay untouched, per
// CLAUDE.md ("Dashboard ko touch mat karna... Authentication ko touch mat
// karna").
const EXCLUDED_PREFIXES = ["/dashboard", "/invoices", "/customers", "/estimates", "/expenses", "/login"];

export default function ConditionalNeonGlow() {
  const pathname = usePathname();
  const excluded = EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));
  if (excluded) return null;
  return <NeonEdgeGlow />;
}
