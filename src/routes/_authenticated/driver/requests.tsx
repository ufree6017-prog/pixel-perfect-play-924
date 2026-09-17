import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/fare";
import { mockRideRequests } from "@/lib/mock";

type Decision = "accepted" | "declined";

export const Route = createFileRoute("/_authenticated/driver/requests")({
  component: DriverRequestsPage,
});

function DriverRequestsPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  function decide(id: string, decision: Decision) {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    toast.success(decision === "accepted" ? "Load accepted (demo)" : "Load declined (demo)");
  }

  return (
    <div>
      <DashboardHeading
        title="Live load requests"
        description="Accept or decline is local demo state — real-time matching arrives in the next build."
      />
      <div className="space-y-4">
        {mockRideRequests.map((request) => {
          const decision = decisions[request.id];
          return (
            <Card key={request.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                <div className="min-w-56">
                  <p className="font-display text-lg font-bold">
                    {request.pickupArea} → {request.dropArea}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.vehicleCategoryName} · {request.goodsType}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.distanceKm} km · pickup {request.minutesAway} min away
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Payout</p>
                  <p className="text-xl font-bold text-primary">{formatINR(request.payout)}</p>
                  <p className="text-xs text-muted-foreground">Tolls & state taxes extra</p>
                </div>
                {decision ? (
                  <Badge
                    variant="outline"
                    className={
                      decision === "accepted"
                        ? "border-transparent bg-success/15 text-success"
                        : "border-transparent bg-muted text-muted-foreground"
                    }
                  >
                    {decision === "accepted" ? "Accepted" : "Declined"}
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => decide(request.id, "accepted")}>Accept</Button>
                    <Button variant="outline" onClick={() => decide(request.id, "declined")}>
                      Decline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
