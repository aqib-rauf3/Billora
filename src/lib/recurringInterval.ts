export const RECURRING_INTERVALS = ["weekly", "monthly", "quarterly", "yearly"] as const;
export type RecurringInterval = (typeof RECURRING_INTERVALS)[number];

export const INTERVAL_LABELS: Record<RecurringInterval, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

// Calendar-aware advance (not just +7/+30 days) so a monthly invoice keeps
// landing on the same day-of-month instead of drifting.
export function advanceDate(date: Date, interval: RecurringInterval): Date {
  const next = new Date(date);
  switch (interval) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}
