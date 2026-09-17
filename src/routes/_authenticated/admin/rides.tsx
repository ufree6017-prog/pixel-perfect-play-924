import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { BookingStatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pricingPlaceholders } from "@/lib/brand";
import { formatINR } from "@/lib/fare";
import { mockBookings } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/admin/rides")({
  component: AdminRidesPage,
});

function AdminRidesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState(mockBookings[0]!.id);

  const rides = useMemo(
    () =>
      mockBookings.filter((booking) => {
        const matchesStatus = status === "all" || booking.status === status;
        const haystack =
          `${booking.reference} ${booking.customerName} ${booking.route} ${booking.city} ${booking.vehicleCategoryName}`.toLowerCase();
        return matchesStatus && haystack.includes(query.toLowerCase());
      }),
    [query, status],
  );

  const selected = mockBookings.find((booking) => booking.id === selectedId)!;
  const helper = selected.helperRequested ? pricingPlaceholders.loadingHelperFee : 0;
  const insurance = selected.insuranceOptedIn
    ? Math.round((selected.declaredGoodsValue ?? 0) * pricingPlaceholders.insuranceRateOfDeclaredValue)
    : 0;
  const base = selected.fareEstimate - helper - insurance;
  const commission = Math.round((selected.fareEstimate * pricingPlaceholders.commissionPercent) / 100);

  return (
    <div>
      <DashboardHeading
        title="Rides & deals"
        description="Search, filter and inspect the costing breakdown of any load."
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search reference, customer, route or city"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-sm"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="driver_assigned">Driver assigned</SelectItem>
            <SelectItem value="en_route">En route</SelectItem>
            <SelectItem value="arrived">Arrived</SelectItem>
            <SelectItem value="in_transit">In transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Fare</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map((booking) => (
                <TableRow
                  key={booking.id}
                  onClick={() => setSelectedId(booking.id)}
                  className={`cursor-pointer ${booking.id === selectedId ? "bg-muted/60" : ""}`}
                >
                  <TableCell className="font-medium">{booking.reference}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.route}</TableCell>
                  <TableCell>{booking.vehicleCategoryName}</TableCell>
                  <TableCell className="text-right">{formatINR(booking.fareEstimate)}</TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
              {!rides.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No rides match this search.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Costing breakdown — {selected.reference}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            { label: `Base + distance (${selected.distanceKm} km)`, value: formatINR(base) },
            { label: "Loading helper", value: helper ? formatINR(helper) : "Not opted" },
            { label: "Transit insurance", value: insurance ? formatINR(insurance) : "Not opted" },
            { label: "Tolls & state taxes", value: "Extra, paid at actuals" },
            {
              label: `Platform commission (${pricingPlaceholders.commissionPercent}%)`,
              value: formatINR(commission),
            },
            { label: "Driver payout", value: formatINR(selected.fareEstimate - commission) },
            { label: "Payment method", value: selected.paymentMethod === "online" ? "Online" : "Pay driver directly" },
            { label: "E-Way Bill", value: selected.eWayBillNumber ?? "—" },
            { label: "POD", value: selected.podUploaded ? "Uploaded" : "Pending" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between border-b border-border py-2 last:border-0">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 text-base font-bold">
            <span>Customer total (excl. tolls)</span>
            <span>{formatINR(selected.fareEstimate)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
