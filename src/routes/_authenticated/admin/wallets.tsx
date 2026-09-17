import { createFileRoute } from "@tanstack/react-router";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockDrivers, mockWalletTransactions } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/admin/wallets")({
  component: AdminWalletsPage,
});

function AdminWalletsPage() {
  const driverName = (id: string) => mockDrivers.find((d) => d.id === id)?.name ?? id;
  const commissionLog = mockWalletTransactions.filter((tx) => tx.type === "commission");

  return (
    <div>
      <DashboardHeading
        title="Driver wallets & commission"
        description={`Commission placeholder: ${pricingPlaceholders.commissionPercent}% per trip. Minimum balance ${formatINR(pricingPlaceholders.walletMinimumBalance)}.`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Wallet balances</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Standing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.city}</TableCell>
                  <TableCell>{driver.vehicleCategoryName}</TableCell>
                  <TableCell className="text-right">{formatINR(driver.walletBalance)}</TableCell>
                  <TableCell
                    className={
                      driver.walletBalance < pricingPlaceholders.walletMinimumBalance
                        ? "text-destructive"
                        : "text-success"
                    }
                  >
                    {driver.walletBalance < pricingPlaceholders.walletMinimumBalance
                      ? "Below minimum"
                      : "Healthy"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Commission log</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead className="text-right">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionLog.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>{driverName(tx.driverId)}</TableCell>
                  <TableCell>{tx.bookingReference ?? "—"}</TableCell>
                  <TableCell className="text-right font-semibold text-destructive">
                    {formatINR(tx.amount)}
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
