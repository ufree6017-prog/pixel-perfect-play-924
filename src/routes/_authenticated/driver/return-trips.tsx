import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/fare";
import { mockReturnTripLoads } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/driver/return-trips")({
  component: DriverReturnTripsPage,
});

function DriverReturnTripsPage() {
  return (
    <div>
      <DashboardHeading
        title="Return trip board"
        description="Discounted loads for the empty leg back. Rates shown are indicative placeholders."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {mockReturnTripLoads.map((load) => {
          const saving = Math.round(
            ((load.standardRate - load.discountedRate) / load.standardRate) * 100,
          );
          return (
            <Card key={load.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold">
                      {load.fromCity} → {load.toCity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {load.vehicleCategoryName} · {load.weightTons} tons
                    </p>
                  </div>
                  <Badge variant="outline" className="border-transparent bg-accent/25 text-accent-foreground">
                    {saving}% off
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatINR(load.discountedRate)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatINR(load.standardRate)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Pickup: {load.pickupWindow}</p>
                <Button
                  className="w-full"
                  onClick={() => toast.success("Return load booked (demo)")}
                >
                  Book this return load
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
