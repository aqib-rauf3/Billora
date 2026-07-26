const STYLES: Record<string, string> = {
  paid: "bg-greenBg text-green",
  approved: "bg-greenBg text-green",
  pending: "bg-amberBg text-amber",
  draft: "bg-border/60 text-muted",
  overdue: "bg-redBg text-red",
  rejected: "bg-redBg text-red",
};

const LABELS: Record<string, string> = {
  paid: "Paid",
  approved: "Approved",
  pending: "Pending",
  draft: "Draft",
  overdue: "Overdue",
  rejected: "Rejected",
};

// Shared colored status pill — reused by InvoiceTable and the Estimates
// list so "pending", "paid" etc. always look the same across the app.
export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block text-xs rounded-full px-2.5 py-1 font-medium ${
        STYLES[status] ?? "bg-border/60 text-muted"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
