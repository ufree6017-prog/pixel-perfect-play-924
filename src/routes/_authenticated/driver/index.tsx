import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { IndianRupee, Star, Truck, Wallet } from "lucide-react";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { ExpiryBadge, VerificationBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatINR } from "@/lib/fare";
import { pricingPlaceholders } from "@/lib/brand";
import { mockCurrentDriver, mockDriverTrips, mockRideRequests } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/driver/")({
  component: DriverDashboardPage,
});

function DriverDashboardPage() {
  const driver = mockCurrentDriver;
  const [previewApproved, setPreviewApproved] = useState(driver.verificationStatus === "approved");

  const stats = [
    { label: "Wallet balance", value: formatINR(driver.walletBalance), icon: Wallet },
    { label: "Total trips", value: driver.totalTrips.toLocaleString("en-IN"), icon: Truck },
    { label: "Rating", value: `${driver.rating} / 5`, icon: Star },
    {
      label: "Last 3 trips (net)",
      value: formatINR(mockDriverTrips.reduce((sum, trip) => sum + trip.netEarning, 0)),
      icon: IndianRupee,
    },
  ];

  return (
    <div>
      <DashboardHeading
        title={`Namaste, ${driver.name}`}
        description={`${driver.vehicleCategoryName} · ${driver.vehicleNumber} · ${driver.city}`}
        action={<VerificationBadge status={driver.verificationStatus} />}
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div>
            <Label htmlFor="preview-approved" className="text-sm font-semibold">
              Preview approved dashboard
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Demo toggle only — switches between the pending-verification screen and the full
              driver dashboard.
            </p>
          </div>
          <Switch
            id="preview-approved"
            checked={previewApproved}
            onCheckedChange={setPreviewApproved}
          />
        </CardContent>
      </Card>

      {!previewApproved ? (
        <Card>
          <CardHeader>
            <CardTitle>Verification in progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Our team is reviewing your documents. Verification usually finishes within 24–48
              working hours. You will be able to accept loads as soon as it is done.
            </p>
            <ul className="space-y-2">
              {driver.documents.map((doc) => (
                <li
                  key={doc.type}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <span className="font-medium text-foreground">{doc.label}</span>
                  <span className="text-xs">{doc.fileName}</span>
                  <ExpiryBadge documentExpiryDate={doc.documentExpiryDate} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <stat.icon className="mb-3 size-5 text-primary" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {driver.walletBalance < pricingPlaceholders.walletMinimumBalance ? (
            <Card className="border-destructive/40">
              <CardContent className="pt-6 text-sm">
                Your wallet is below the minimum balance of{" "}
                {formatINR(pricingPlaceholders.walletMinimumBalance)}. Top up to keep receiving new
                loads.
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Nearby load requests</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to="/driver/requests">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRideRequests.slice(0, 2).map((request) => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">
                      {request.pickupArea} → {request.dropArea}
                    </p>
                    <p className="text-muted-foreground">
                      {request.distanceKm} km · {request.goodsType}
                    </p>
                  </div>
                  <p className="font-bold text-primary">{formatINR(request.payout)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
