import type { ComponentType } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

// Shared empty state — every list page (Invoices/Estimates/Expenses/
// Customers) shows this instead of a blank table when a search/filter
// combination returns nothing, per UI_RULES.md "never leave blank screens".
export default function EmptyState({ icon: IconEl, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center mb-4">
        <IconEl size={22} className="text-muted" />
      </div>
      <p className="text-sm font-medium text-ink mb-1">{title}</p>
      <p className="text-xs text-muted max-w-[280px] mb-4">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-xs text-navy dark:text-[#8FA9E8] font-medium hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
