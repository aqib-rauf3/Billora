import type { ComponentType } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  tone?: "default" | "warning";
}

// Small metric card used across Dashboard, Estimates, and Expenses ("Total
// earned", "Outstanding", etc.) — one component so the number/label layout
// stays identical everywhere per COMPONENT_GUIDE.md's "DashboardCard".
export default function StatCard({ label, value, icon: IconEl, tone = "default" }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted">{label}</p>
        {IconEl && <IconEl size={16} className="text-muted" />}
      </div>
      <p className={`text-xl font-medium ${tone === "warning" ? "text-red" : "text-ink"}`}>{value}</p>
    </div>
  );
}
