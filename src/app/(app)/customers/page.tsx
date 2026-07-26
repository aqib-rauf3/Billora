"use client";

// Customer Management
// Reference mockup: billora_customer_management_page.png
// Search + grid of customer cards, "Add customer" quick-add modal.

import { useMemo, useState } from "react";
import { IconSearch, IconUsers, IconPlus, IconMail } from "@tabler/icons-react";
import EmptyState from "@/components/dashboard/EmptyState";
import Modal from "@/components/ui/Modal";
import { CUSTOMERS as INITIAL_CUSTOMERS, INVOICES, invoiceTotal } from "@/lib/mockData";
import type { MockCustomer } from "@/lib/mockData";

const money = (n: number) => `Rs. ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface";
const labelClass = "text-xs text-text block mb-1.5";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

let idCounter = 0;

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<MockCustomer[]>(INITIAL_CUSTOMERS);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const filtered = useMemo(() => {
    if (query.trim() === "") return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
  };

  const handleAdd = () => {
    if (name.trim().length < 2) return;
    // TODO: POST to /api/customers once wired to Prisma (DEVELOPMENT_RULES.md).
    const newCustomer: MockCustomer = {
      id: `local-${idCounter++}`,
      name: name.trim(),
      company: company.trim() || "—",
      email: email.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    resetForm();
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-medium text-ink">Customers</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-orange text-white rounded-md px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          <IconPlus size={16} />
          Add customer
        </button>
      </div>

      <div className="mb-5">
        <div className="relative w-full sm:w-64">
          <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search customers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm border border-border rounded-md pl-9 pr-3 py-2 outline-none focus:border-navy dark:focus:border-[#5B7FDB] bg-surface transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg">
          <EmptyState
            icon={IconUsers}
            title="No customers found"
            description="Try a different search, or add a new customer."
            action={{ label: "Add customer", onClick: () => setModalOpen(true) }}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const customerInvoices = INVOICES.filter((inv) => inv.customerId === c.id);
            const billed = customerInvoices
              .filter((inv) => inv.status === "paid")
              .reduce((sum, inv) => sum + invoiceTotal(inv), 0);

            return (
              <div
                key={c.id}
                className="bg-surface border border-border rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-full bg-navy text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                    <p className="text-xs text-muted truncate">{c.company}</p>
                  </div>
                </div>

                {c.email && (
                  <p className="flex items-center gap-1.5 text-xs text-muted mb-3.5 truncate">
                    <IconMail size={13} className="flex-shrink-0" />
                    {c.email}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wide">Invoices</p>
                    <p className="text-sm text-ink font-mono">{customerInvoices.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted uppercase tracking-wide">Total paid</p>
                    <p className="text-sm text-ink font-mono">{money(billed)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add customer"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="text-sm text-muted hover:text-ink px-3 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="bg-navy text-white rounded-md px-4 py-2 text-sm hover:bg-navyLight transition-colors"
            >
              Add
            </button>
          </>
        }
      >
        <div className="mb-3.5">
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Client or contact name"
          />
        </div>
        <div className="mb-3.5">
          <label className={labelClass}>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
            placeholder="Business name (optional)"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="client@company.com"
          />
        </div>
      </Modal>
    </div>
  );
}
