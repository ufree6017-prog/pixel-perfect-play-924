import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/drivers", label: "Driver verification" },
  { to: "/admin/rides", label: "Rides & costing" },
  { to: "/admin/enquiries", label: "Business queries" },
  { to: "/admin/invoices", label: "GST invoices" },
  { to: "/admin/wallets", label: "Wallets & commission" },
  { to: "/admin/return-trips", label: "Return trip board" },
  { to: "/admin/documents", label: "Document expiry" },
];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — TruckSetu" },
      { name: "description", content: "Operations, verification, billing and analytics." },
    ],
  }),
  component: () => (
    <DashboardShell area="Admin dashboard" nav={nav}>
      <Outlet />
    </DashboardShell>
  ),
});
