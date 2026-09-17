import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/fare";
import { mockReturnTripLoads } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/admin/return-trips")({
  component: AdminReturnTripsPage,
});

function AdminReturnTripsPage() {
  const [published, setPublished] = useState<Record<string, boolean>>(
    Object.fromEntries(mockReturnTripLoads.map((load) => [load.id, true])),
  );

  return (
    <div>
      <DashboardHeading
        title="Return trip board management"
        description="Publish or hold discounted empty-leg loads shown to drivers."
      />
      <div className="space-y-4">
        {mockReturnTripLoads.map((load) => (
          <Card key={load.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-display text-lg font-bold">
                  {load.fromCity} → {load.toCity}
                </p>
                <p className="text-sm text-muted-foreground">
                  {load.vehicleCategoryName} · {load.weightTons} tons · {load.pickupWindow}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold text-primary">{formatINR(load.discountedRate)}</p>
                <p className="text-muted-foreground line-through">
                  {formatINR(load.standardRate)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  published[load.id]
                    ? "border-transparent bg-success/15 text-success"
                    : "border-transparent bg-muted text-muted-foreground"
                }
              >
                {published[load.id] ? "Live on board" : "On hold"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPublished((prev) => ({ ...prev, [load.id]: !prev[load.id] }));
                  toast.success("Return load updated (demo)");
                }}
              >
                {published[load.id] ? "Hold" : "Publish"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
