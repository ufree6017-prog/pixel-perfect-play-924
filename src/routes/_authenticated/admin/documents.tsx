import { createFileRoute } from "@tanstack/react-router";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { ExpiryBadge, expiryState } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDrivers } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/admin/documents")({
  component: AdminDocumentsPage,
});

function AdminDocumentsPage() {
  const rows = mockDrivers.flatMap((driver) =>
    driver.documents.map((doc) => ({
      key: `${driver.id}-${doc.type}`,
      driver: driver.name,
      vehicleNumber: driver.vehicleNumber,
      city: driver.city,
      label: doc.label,
      documentExpiryDate: doc.documentExpiryDate,
      state: expiryState(doc.documentExpiryDate),
    })),
  );
  const attention = rows.filter((row) => row.state !== "valid");

  return (
    <div>
      <DashboardHeading
        title="Document expiry monitoring"
        description="Documents expiring within 45 days are flagged. Expired documents should take a driver offline."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Documents tracked", value: rows.length },
          { label: "Expiring soon", value: rows.filter((r) => r.state === "expiring_soon").length },
          { label: "Expired", value: rows.filter((r) => r.state === "expired").length },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs attention ({attention.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DocTable rows={attention} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All documents</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DocTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

function DocTable({
  rows,
}: {
  rows: Array<{
    key: string;
    driver: string;
    vehicleNumber: string;
    city: string;
    label: string;
    documentExpiryDate: string | null;
  }>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Driver</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Document</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell className="font-medium">{row.driver}</TableCell>
            <TableCell>{row.vehicleNumber}</TableCell>
            <TableCell>{row.city}</TableCell>
            <TableCell>{row.label}</TableCell>
            <TableCell className="whitespace-nowrap">
              {row.documentExpiryDate
                ? new Date(row.documentExpiryDate).toLocaleDateString("en-IN")
                : "—"}
            </TableCell>
            <TableCell>
              <ExpiryBadge documentExpiryDate={row.documentExpiryDate} />
            </TableCell>
          </TableRow>
        ))}
        {!rows.length ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              Nothing to review.
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  );
}
