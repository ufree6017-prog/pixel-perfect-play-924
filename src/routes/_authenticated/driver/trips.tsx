import { createFileRoute } from "@tanstack/react-router";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "@/lib/fare";
import { mockDriverTrips } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/driver/trips")({
  component: DriverTripsPage,
});

function DriverTripsPage() {
  const gross = mockDriverTrips.reduce((sum, trip) => sum + trip.fareCollected, 0);
  const commission = mockDriverTrips.reduce((sum, trip) => sum + trip.commissionDeducted, 0);
  const net = mockDriverTrips.reduce((sum, trip) => sum + trip.netEarning, 0);

  return (
    <div>
      <DashboardHeading title="Trips & earnings" description="Completed trips with commission deducted." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Fare collected", value: gross },
          { label: "Commission deducted", value: commission },
          { label: "Net earnings", value: net },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-xl font-bold">{formatINR(item.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Trip history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="text-right">Fare</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>POD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDriverTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.bookingReference}</TableCell>
                  <TableCell>{trip.route}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(trip.completedAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">{formatINR(trip.fareCollected)}</TableCell>
                  <TableCell className="text-right text-destructive">
                    −{formatINR(trip.commissionDeducted)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatINR(trip.netEarning)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        trip.podUploaded
                          ? "border-transparent bg-success/15 text-success"
                          : "border-transparent bg-accent/25 text-accent-foreground"
                      }
                    >
                      {trip.podUploaded ? "Uploaded" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
