import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { InvoiceStatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "@/lib/fare";
import { mockInvoices } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/admin/invoices")({
  component: AdminInvoicesPage,
});

function AdminInvoicesPage() {
  return (
    <div>
      <DashboardHeading
        title="GST invoice records"
        description="Invoices unlock once the POD is uploaded. PDF generation is not wired yet."
      />
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead className="text-right">Taxable</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>POD</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.bookingReference}</TableCell>
                  <TableCell>{invoice.businessName}</TableCell>
                  <TableCell className="whitespace-nowrap">{invoice.gstin}</TableCell>
                  <TableCell className="text-right">{formatINR(invoice.taxableValue)}</TableCell>
                  <TableCell className="text-right">{formatINR(invoice.gstAmount)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatINR(invoice.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        invoice.podUploaded
                          ? "border-transparent bg-success/15 text-success"
                          : "border-transparent bg-accent/25 text-accent-foreground"
                      }
                    >
                      {invoice.podUploaded ? "Uploaded" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!invoice.podUploaded}
                      onClick={() => toast.success(`${invoice.invoiceNumber} downloaded (demo)`)}
                    >
                      Download
                    </Button>
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
