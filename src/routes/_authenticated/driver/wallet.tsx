import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { mockCurrentDriver, mockWalletTransactions } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/driver/wallet")({
  component: DriverWalletPage,
});

function DriverWalletPage() {
  const driver = mockCurrentDriver;
  const [amount, setAmount] = useState("1000");
  const transactions = mockWalletTransactions.filter((tx) => tx.driverId === driver.id);

  return (
    <div>
      <DashboardHeading
        title="Wallet"
        description={`Commission is ${pricingPlaceholders.commissionPercent}% per trip. Wallet math is mocked for now.`}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatINR(driver.walletBalance)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Minimum balance to stay online: {formatINR(pricingPlaceholders.walletMinimumBalance)}
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top up wallet</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <div className="grow">
              <Label htmlFor="topup">Amount (₹)</Label>
              <Input
                id="topup"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <Button onClick={() => toast.success(`Top-up of ₹${amount} started (demo)`)}>
              Top up via UPI
            </Button>
            <p className="w-full text-xs text-muted-foreground">
              Payment gateway is not connected in this build.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>{tx.label}</TableCell>
                  <TableCell>{tx.bookingReference ?? "—"}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${tx.amount < 0 ? "text-destructive" : "text-success"}`}
                  >
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
