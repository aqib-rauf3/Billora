"use client";

import { usePathname } from "next/navigation";
import { isExcludedFromMarketingEffects } from "@/lib/marketingRoutes";
import NeonEdgeGlow from "./NeonEdgeGlow";

// Marketing pages only — see src/lib/marketingRoutes.ts for the excluded
// app/auth prefixes.
export default function ConditionalNeonGlow() {
  const pathname = usePathname();
  if (isExcludedFromMarketingEffects(pathname)) return null;
  return <NeonEdgeGlow />;
}
