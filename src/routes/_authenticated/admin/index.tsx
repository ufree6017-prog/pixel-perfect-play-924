import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "@/lib/fare";
import {
  mockBookings,
  mockBookingsByCity,
  mockDemandSupplyGaps,
  mockDrivers,
  mockDriverUtilisation,
  mockRevenueTrend,
  mockTopRoutes,
} from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const latest = mockRevenueTrend[mockRevenueTrend.length - 1]!;
  const kpis = [
    { label: "Revenue this month", value: formatINR(latest.revenue) },
    { label: "Bookings this month", value: latest.bookings.toLocaleString("en-IN") },
    { label: "Active bookings", value: String(mockBookings.filter((b) => b.status !== "delivered" && b.status !== "cancelled").length) },
    { label: "Drivers pending review", value: String(mockDrivers.filter((d) => d.verificationStatus === "pending").length) },
  ];

  return (
    <div>
      <DashboardHeading
        title="Operations overview"
        description="All figures are seeded demo data for layout review."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRevenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value: number) => `${Math.round(value / 100000)}L`}
                />
                <Tooltip formatter={(value: number) => formatINR(value)} />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by city</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBookingsByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="city" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="bookings" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demand vs supply</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDemandSupplyGaps}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="city" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="demand" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver utilisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockDriverUtilisation.map((row) => (
              <div key={row.segment}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{row.segment}</span>
                  <span className="font-semibold">{row.utilisation}%</span>
                </div>
                <Progress value={row.utilisation} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top routes</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Loads</TableHead>
                <TableHead className="text-right">Average fare</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopRoutes.map((row) => (
                <TableRow key={row.route}>
                  <TableCell className="font-medium">{row.route}</TableCell>
                  <TableCell className="text-right">{row.loads}</TableCell>
                  <TableCell className="text-right">{formatINR(row.avgFare)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
