// App shell layout — wraps Dashboard, Invoices, Estimates, Expenses, Customers
// Reference: sidebar nav seen in all billora_*_page.html app screens (Billora logo, Dashboard/Invoices/Estimates/Expenses/Customers/Reports links)

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* TODO: <Sidebar /> component — see src/components/layout/Sidebar.tsx */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
