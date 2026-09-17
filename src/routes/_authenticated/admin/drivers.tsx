import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { ExpiryBadge, VerificationBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/fare";
import { mockDrivers } from "@/lib/mock";
import type { DriverVerificationStatus } from "@/lib/mock/types";

export const Route = createFileRoute("/_authenticated/admin/drivers")({
  component: AdminDriversPage,
});

function AdminDriversPage() {
  const [statuses, setStatuses] = useState<Record<string, DriverVerificationStatus>>(
    Object.fromEntries(mockDrivers.map((driver) => [driver.id, driver.verificationStatus])),
  );

  function decide(id: string, status: DriverVerificationStatus, name: string) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    toast.success(`${name} ${status === "approved" ? "approved" : "rejected"} (demo)`);
  }

  return (
    <div>
      <DashboardHeading
        title="Driver verification queue"
        description="Approve or reject is demo state — no records are written yet."
      />
      <div className="space-y-4">
        {mockDrivers.map((driver) => {
          const status = statuses[driver.id]!;
          return (
            <Card key={driver.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={driver.photoUrl}
                    alt={`${driver.name}, TruckSetu driver`}
                    className="size-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <CardTitle className="text-base">{driver.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {driver.vehicleCategoryName} · {driver.vehicleNumber} · {driver.city}
                    </p>
                  </div>
                </div>
                <VerificationBadge status={status} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                  <p>Phone: {driver.phone}</p>
                  <p>Rating: {driver.rating} / 5 · {driver.totalTrips} trips</p>
                  <p>Wallet: {formatINR(driver.walletBalance)}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {driver.documents.map((doc) => (
                    <div
                      key={doc.type}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                    >
                      <span className="font-medium">{doc.label}</span>
                      <ExpiryBadge documentExpiryDate={doc.documentExpiryDate} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={status === "approved"}
                    onClick={() => decide(driver.id, "approved", driver.name)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={status === "rejected"}
                    onClick={() => decide(driver.id, "rejected", driver.name)}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
