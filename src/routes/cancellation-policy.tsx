import { createFileRoute, Link } from "@tanstack/react-router";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { brand, pricingPlaceholders } from "@/lib/brand";
import { formatINR } from "@/lib/fare";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: [
      { title: `Cancellation & refund policy — ${brand.name}` },
      {
        name: "description",
        content:
          "When cancellation is free, when a fee applies, what happens if the driver cancels, and how refunds are processed for online payments.",
      },
      { property: "og:title", content: `Cancellation & refund policy — ${brand.name}` },
      {
        property: "og:description",
        content: "Free cancellation window, cancellation fees and how refunds are processed.",
      },
    ],
  }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  const { freeCancellationMinutes, cancellationFee } = pricingPlaceholders;

  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Legal"
        title="Cancellation & refund policy"
        description={`Cancel free within ${freeCancellationMinutes} minutes. After that a flat fee covers the driver's approach trip.`}
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="card-elevated overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When you cancel</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Refund</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Within {freeCancellationMinutes} minutes of confirmation</TableCell>
                <TableCell>No fee</TableCell>
                <TableCell>Full refund</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>After {freeCancellationMinutes} minutes, before pickup</TableCell>
                <TableCell>{formatINR(cancellationFee)}</TableCell>
                <TableCell>Balance refunded</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>After the driver has loaded the goods</TableCell>
                <TableCell>Fare for distance covered + waiting</TableCell>
                <TableCell>Balance refunded</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Driver cancels or does not arrive</TableCell>
                <TableCell>No fee to you</TableCell>
                <TableCell>Full refund</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-10 space-y-8">
          <div>
            <h2 className="text-lg font-semibold">How refunds are processed</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Online payments are refunded to the original payment method. Bank processing normally
              takes 3 to 7 working days. If you chose to pay the driver directly, there is nothing
              to refund unless a cancellation fee was already collected.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Waiting time</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A free waiting period applies at pickup and at delivery. Beyond that, waiting charges
              accrue and are added to the final bill. If your goods are not ready, cancelling early
              is cheaper than making the driver wait.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Business and bulk bookings</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Intercity container, flatbed and trailer bookings involve permits and a positioning
              trip. Cancellation terms for those loads are set out in your freight quote and may
              differ from the table above.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Disputes</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If you believe a cancellation fee was charged unfairly, contact support with your
              booking reference within 7 days and we will review the trip record.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/terms">Read full terms</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
