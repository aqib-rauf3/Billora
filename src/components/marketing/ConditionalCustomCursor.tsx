"use client";

import { usePathname } from "next/navigation";
import { isExcludedFromMarketingEffects } from "@/lib/marketingRoutes";
import CustomCursor from "./CustomCursor";

// Marketing pages only — see src/lib/marketingRoutes.ts for the excluded
// app/auth prefixes. The dashboard/app shell keeps the native cursor since
// it's a working tool, not a marketing surface.
export default function ConditionalCustomCursor() {
  const pathname = usePathname();
  if (isExcludedFromMarketingEffects(pathname)) return null;
  return <CustomCursor />;
}
