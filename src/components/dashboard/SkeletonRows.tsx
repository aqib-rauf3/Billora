// Shared loading placeholder for table-style list pages (Invoices,
// Estimates, Expenses) — pulses in place of real rows while the API call
// is in flight, per UI_RULES.md "every async action should display skeleton
// loaders... avoid layout shifts".
export default function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 border-b border-border last:border-0 animate-pulse"
        >
          <div className="h-3.5 bg-border/60 rounded col-span-2 md:col-span-1 w-2/3" />
          <div className="h-3 bg-border/60 rounded w-16" />
          <div className="h-3 bg-border/60 rounded w-20" />
          <div className="h-3.5 bg-border/60 rounded w-16 md:ml-auto" />
          <div className="h-5 bg-border/60 rounded-full w-14 md:ml-auto" />
        </div>
      ))}
    </div>
  );
}
