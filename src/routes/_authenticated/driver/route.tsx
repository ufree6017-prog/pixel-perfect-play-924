import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { to: "/driver", label: "Dashboard" },
  { to: "/driver/requests", label: "Live requests" },
  { to: "/driver/return-trips", label: "Return trips" },
  { to: "/driver/wallet", label: "Wallet" },
  { to: "/driver/trips", label: "Trips & earnings" },
  { to: "/driver/pod", label: "Upload POD" },
  { to: "/driver/documents", label: "Documents" },
];

export const Route = createFileRoute("/_authenticated/driver")({
  head: () => ({
    meta: [
      { title: "Driver portal — TruckSetu" },
      { name: "description", content: "Manage trips, wallet, return loads and documents." },
    ],
  }),
  component: () => (
    <DashboardShell area="Driver portal" nav={nav}>
      <Outlet />
    </DashboardShell>
  ),
});
