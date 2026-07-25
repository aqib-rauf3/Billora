"use client";

import { useState } from "react";

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

let counter = 0;
const nextId = () => `item-${Date.now()}-${counter++}`;

const emptyItem = (): LineItem => ({ id: nextId(), description: "", qty: 1, rate: 0 });

// Shared state manager for the editable line-item rows used across the
// invoice generator, estimate generator, and receipt maker free tools.
export function useLineItems(initial: number = 2) {
  const [items, setItems] = useState<LineItem[]>(() =>
    Array.from({ length: initial }, emptyItem)
  );

  const update = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const add = () => setItems((prev) => [...prev, emptyItem()]);

  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const subtotal = items.reduce((sum, it) => sum + it.qty * it.rate, 0);

  return { items, update, add, remove, subtotal };
}
