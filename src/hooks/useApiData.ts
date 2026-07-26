"use client";

import { useCallback, useEffect, useState } from "react";

// Shared by every app page (Invoices, Customers, Estimates, Expenses,
// Dashboard) that lists data from src/app/api/*, so loading/error/refetch
// handling isn't rewritten five times. Each API route returns `{ [key]:
// T[] }` (see e.g. /api/invoices -> `{ invoices: [...] }`) — pass that key.
export function useApiData<T>(url: string, key: string) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Failed to load (${res.status}).`);
      }
      const body = await res.json();
      setData(body[key] ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [url, key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
