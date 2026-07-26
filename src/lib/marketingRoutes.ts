// Shared by ConditionalNeonGlow and ConditionalCustomCursor — app/auth
// routes are excluded from marketing-only ambient effects, per CLAUDE.md
// ("Dashboard ko touch mat karna... Authentication ko touch mat karna").
export const EXCLUDED_APP_PREFIXES = [
  "/dashboard",
  "/invoices",
  "/customers",
  "/estimates",
  "/expenses",
  "/login",
];

export function isExcludedFromMarketingEffects(pathname: string): boolean {
  return EXCLUDED_APP_PREFIXES.some((p) => pathname.startsWith(p));
}
