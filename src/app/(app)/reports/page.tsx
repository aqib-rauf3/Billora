"use client";

// Reports — Phase 2 module. Pure aggregation view: every number here comes
// from /api/reports, which computes it from existing Invoice/Expense
// records (no separate Report model). Revenue-vs-expenses over the last 6
// months, expenses by category, outstanding vs paid, top customers.

import { useEffect, useState } from "react";
import {
  IconTrendingUp,
  IconAlertCircle,
  IconReceipt2,
  IconChartBar,
} from "@tabler/icons-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import ErrorState from "@/components/dashboard/ErrorState";
import EmptyState from "@/components/dashboard/EmptyState";
import { money } from "@/lib/liveData";

interface ReportsData {
  summary: {
    totalPaid: number;
    totalOutstanding: number;
    totalExpenses: number;
    netProfit: number;
    invoiceCount: number;
    customerCount: number;
  };
  revenueSeries: { month: string; revenue: number; expenses: number }[];
  expensesByCategory: { category: string; amount: number }[];
  topCustomers: { name: string; total: number }[];
}

const PIE_COLORS = ["#FF4B36", "#0B2545", "#1F8B4C", "#B8720C", "#7A84AC", "#C7371D"];

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Couldn't load reports.");
      }
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-ink">Reports</h1>
        <p className="text-sm text-muted mt-1">
          How your business is doing, computed from your invoices and expenses.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[84px] bg-surface border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-surface border border-border rounded-lg">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Revenue collected" value={money(data.summary.totalPaid)} icon={IconTrendingUp} />
            <StatCard
              label="Outstanding"
              value={money(data.summary.totalOutstanding)}
              icon={IconAlertCircle}
              tone={data.summary.totalOutstanding > 0 ? "warning" : "default"}
            />
            <StatCard label="Total expenses" value={money(data.summary.totalExpenses)} icon={IconReceipt2} />
            <StatCard
              label="Net profit"
              value={money(data.summary.netProfit)}
              icon={IconChartBar}
              tone={data.summary.netProfit < 0 ? "warning" : "default"}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-5">
              <p className="text-sm font-medium text-ink mb-4">Revenue vs. expenses — last 6 months</p>
              {data.revenueSeries.every((m) => m.revenue === 0 && m.expenses === 0) ? (
                <EmptyState
                  icon={IconChartBar}
                  title="Nothing to chart yet"
                  description="Paid invoices and logged expenses will show up here month by month."
                />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.revenueSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D9E0F5" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7A84AC" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#7A84AC" }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip
                      formatter={(value: number) => money(value)}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #D9E0F5" }}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#FF4B36" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#0B2545" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-surface border border-border rounded-lg p-5">
              <p className="text-sm font-medium text-ink mb-4">Expenses by category</p>
              {data.expensesByCategory.length === 0 ? (
                <EmptyState icon={IconReceipt2} title="No expenses yet" description="Log an expense to see the breakdown." />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={data.expensesByCategory}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                      >
                        {data.expensesByCategory.map((entry, i) => (
                          <Cell key={entry.category} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => money(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {data.expensesByCategory.map((c, i) => (
                      <div key={c.category} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-text">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          {c.category}
                        </span>
                        <span className="text-muted font-mono">{money(c.amount)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-5">
            <p className="text-sm font-medium text-ink mb-4">Top customers by revenue</p>
            {data.topCustomers.length === 0 ? (
              <EmptyState icon={IconTrendingUp} title="No paid invoices yet" description="Once invoices are paid, your best customers show up here." />
            ) : (
              <div className="space-y-3">
                {data.topCustomers.map((c, i) => {
                  const max = data.topCustomers[0].total || 1;
                  return (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-ink">
                          {i + 1}. {c.name}
                        </span>
                        <span className="text-muted font-mono">{money(c.total)}</span>
                      </div>
                      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange rounded-full"
                          style={{ width: `${(c.total / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
